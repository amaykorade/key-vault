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

  const session = await prisma.session.create({
    data: {
      token,
      expiresAt,
      userId
    }
  })

  return session
}

export async function validateSession(token) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session.user
}

export async function deleteSession(token) {
  await prisma.session.delete({
    where: { token }
  })
}

export async function createUser(email, password, name = null) {
  const hashedPassword = await hashPassword(password)
  
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })
}

export async function authenticateUser(email, password) {
  const user = await prisma.user.findUnique({
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
  const sessionToken = request.cookies.get('session_token')?.value

  if (!sessionToken) {
    return null
  }

  return await validateSession(sessionToken)
} 

export async function createRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      expiresAt,
      userId
    }
  });

  return refreshToken;
} 