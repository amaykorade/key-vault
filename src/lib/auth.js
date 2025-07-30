import bcrypt from 'bcryptjs'
import crypto from 'crypto'
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

  return session.users
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
      name
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

export async function getCurrentUser(request) {
  // 1. Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    // Try session token first
    let user = await validateSession(token);
    if (user) return user;
    
    // Try API token
    user = await prisma.users.findUnique({ where: { apiToken: token } });
    if (user) return user;
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