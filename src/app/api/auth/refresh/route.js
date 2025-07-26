import { NextResponse } from 'next/server'
import prisma from '../../../../lib/database'
import { createSession, createRefreshToken } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const refreshTokenValue = request.cookies.get('refresh_token')?.value
    if (!refreshTokenValue) {
      return NextResponse.json({ message: 'No refresh token provided' }, { status: 401 })
    }

    // Find refresh token in DB
    const dbToken = await prisma.refresh_tokens.findUnique({
      where: { token: refreshTokenValue },
      include: { users: true }
    })

    if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
      // Clear cookies if invalid
      const response = NextResponse.json({ message: 'Invalid or expired refresh token' }, { status: 401 })
      response.cookies.set('session_token', '', { httpOnly: true, maxAge: 0, path: '/' })
      response.cookies.set('refresh_token', '', { httpOnly: true, maxAge: 0, path: '/' })
      return response
    }

    // Issue new session token
    const session = await createSession(dbToken.userId)
    // Optionally, rotate refresh token
          await prisma.refresh_tokens.update({
      where: { token: dbToken.token },
      data: { revoked: true }
    })
    const newRefreshToken = await createRefreshToken(dbToken.userId)

    const response = NextResponse.json({
      message: 'Token refreshed',
      session: {
        token: session.token,
        expiresAt: session.expiresAt
      },
      refreshToken: {
        expiresAt: newRefreshToken.expiresAt
      }
    })
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })
    response.cookies.set('refresh_token', newRefreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })
    return response
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
} 