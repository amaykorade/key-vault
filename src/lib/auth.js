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

// New: Enhanced getCurrentUser function that supports both sessions and API tokens
export async function getCurrentUser(request) {
  try {
    // First, try to get API token from Authorization header
    const authHeader = request.headers.get('authorization')
    let user = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiToken = authHeader.substring(7) // Remove 'Bearer ' prefix
      
      // Validate API token
      const tokenRecord = await prisma.api_tokens.findUnique({
        where: { 
          token: apiToken,
          isActive: true
        },
        include: {
          users: true
        }
      })

      if (tokenRecord && tokenRecord.users) {
        // Check if token is expired
        if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
          return null
        }

        // Update last used timestamp
        await prisma.api_tokens.update({
          where: { id: tokenRecord.id },
          data: { lastUsedAt: new Date() }
        })

        user = tokenRecord.users
        
        // MINIMAL FIX: Load permissions for API token users
        if (user.role === 'ADMIN') {
          user = {
            ...user,
            permissions: [
              'keys:read', 'keys:write', 'keys:delete', 'keys:rotate',
              'folders:read', 'folders:write', 'folders:delete',
              'projects:read', 'projects:write', 'projects:delete',
              'api:read', 'api:write', 'api:admin'
            ]
          };
        } else {
          user = {
            ...user,
            permissions: ['keys:read', 'folders:read', 'api:read']
          };
        }
      }
    }

    // If no API token, try session token
    if (!user) {
      const sessionToken = request.cookies.get('session_token')?.value

      if (sessionToken) {
        // Validate session
        user = await validateSession(sessionToken)
      }
    }

    return user
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
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