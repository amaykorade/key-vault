import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from './database.js'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

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
  // 1. Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // Try session token first
    let user = await validateSession(token);
    if (user) return user;
    // Try API token
    user = await prisma.user.findUnique({ where: { apiToken: token } });
    if (user) return user;
  }

  // 2. Check for NextAuth session cookie
  const nextAuthSession = request.cookies.get('next-auth.session-token')?.value;
  if (nextAuthSession) {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || "USER",
      };
    }
  }
  // 3. Fallback to legacy session_token logic
  const sessionToken = request.cookies.get('session_token')?.value;
  if (!sessionToken) {
    return null;
  }
  return await validateSession(sessionToken);
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