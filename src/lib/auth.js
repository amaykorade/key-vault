import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from './database.js'

export async function hashPassword(password) {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const session = await prisma.sessions.create({
    data: {
      token,
      expiresAt,
      userId
    }
  })

  return session
}

export async function validateSession(token) {
  const session = await prisma.sessions.findUnique({
    where: { token },
    include: { users: true }
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  const user = session.users;
  
  // Provide permissions for session-based authentication
  if (user.role === 'ADMIN') {
    return {
      ...user,
      permissions: [
        'keys:read', 'keys:write', 'keys:delete',
        'folders:read', 'folders:write', 'folders:delete',
        'projects:read', 'projects:write', 'projects:delete'
      ],
      roles: [],
      teamId: null
    };
  } else {
    // Regular users get basic permissions
    return {
      ...user,
      permissions: ['keys:read', 'folders:read'],
      roles: [],
      teamId: null
    };
  }
}

export async function deleteSession(token) {
  await prisma.sessions.delete({
    where: { token }
  })
}

export async function createUser(email, password, name = null) {
  const hashedPassword = await hashPassword(password)
  
  return await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN' // Give new users ADMIN role for full access to their own resources
    }
  })
}

export async function authenticateUser(email, password) {
  const user = await prisma.users.findUnique({
    where: { email }
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return user
}

// New: Create JWT token with embedded permissions
export async function createJWTToken(user, teamId = null) {
  try {
    // Load user permissions using dynamic import to avoid circular dependency
    const { PermissionManager } = await import('./permissions.js');
    const pm = new PermissionManager(user, teamId);
    await pm.loadPermissions();
    
    const permissions = pm.getPermissionsList();
    const roles = pm.getRolePermissionsList();
    
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: permissions,
      roles: roles,
      teamId: teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      algorithm: 'HS256'
    });
    
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('Failed to generate token');
  }
}

// New: Verify JWT token and extract permissions
export async function verifyJWTToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    // Get fresh user data
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return null;
    }
    
    // Return user with embedded permissions
    return {
      ...user,
      permissions: decoded.permissions || [],
      roles: decoded.roles || [],
      teamId: decoded.teamId
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// New: Create API token with specific permissions
export async function createAPIToken(userId, permissions = [], expiresAt = null) {
  const token = crypto.randomBytes(32).toString('hex');
  
  const apiToken = await prisma.api_tokens.create({
    data: {
      token,
      userId,
      permissions: permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true
    }
  });
  
  return apiToken;
}

// New: Validate API token and return permissions
export async function validateAPIToken(token) {
  const apiToken = await prisma.api_tokens.findFirst({
    where: {
      token,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    include: {
      user: true
    }
  });
  
  if (!apiToken) {
    return null;
  }
  
  return {
    ...apiToken.user,
    permissions: apiToken.permissions || [],
    apiTokenId: apiToken.id
  };
}

export async function getCurrentUser(request) {
  // 1. Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    // Try JWT token first (new method)
    let user = await verifyJWTToken(token);
    if (user) return user;
    
    // Try API token
    user = await validateAPIToken(token);
    if (user) return user;
    
    // Try session token (legacy)
    user = await validateSession(token);
    if (user) return user;
    
    // Try legacy API token
    user = await prisma.users.findUnique({ where: { apiToken: token } });
    if (user) {
      // For legacy API tokens, we need to load permissions from database
      // since they don't have embedded permissions like JWT tokens
      try {
        // Get user's primary team for context
        const teamMember = await prisma.team_members.findFirst({
          where: { userId: user.id },
          include: { teams: true },
          orderBy: { joinedAt: 'asc' }
        });
        
        const teamId = teamMember?.teamId || null;
        
        if (teamId) {
          // User is part of a team with RBAC - load team permissions
          const { PermissionManager } = await import('./permissions.js');
          const pm = new PermissionManager(user, teamId);
          await pm.loadPermissions();
          
          return {
            ...user,
            permissions: pm.getPermissionsList(),
            roles: pm.getRolePermissionsList(),
            teamId: teamId
          };
        } else {
          // User is not part of a team - provide permissions based on role
          let permissions = ['keys:read', 'folders:read'];
          
          // ADMIN users get full permissions for their own resources
          if (user.role === 'ADMIN') {
            permissions = [
              'keys:read', 'keys:write', 'keys:delete',
              'folders:read', 'folders:write', 'folders:delete',
              'projects:read', 'projects:write', 'projects:delete'
            ];
          } else if (user.plan === 'FREE' || user.plan === 'PRO' || user.plan === 'TEAM') {
            // Regular users get basic write permissions
            permissions.push('keys:write', 'folders:write');
          }
          
          return {
            ...user,
            permissions: permissions,
            roles: [],
            teamId: null
          };
        }
      } catch (error) {
        console.error('Error loading permissions for legacy API token:', error);
        // Fallback to basic permissions
        return {
          ...user,
          permissions: ['keys:read', 'keys:write', 'folders:read', 'folders:write'],
          roles: [],
          teamId: null
        };
      }
    }
  }

  // 2. Check for legacy session token
  const sessionToken = request.cookies.get('session_token')?.value;
  if (sessionToken) {
    return await validateSession(sessionToken);
  }

  return null;
} 

export async function createRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const refreshToken = await prisma.refresh_tokens.create({
    data: {
      token,
      expiresAt,
      userId
    }
  });

  return refreshToken;
} 