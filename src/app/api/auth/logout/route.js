import { NextResponse } from 'next/server'
import { deleteSession } from '../../../../lib/auth'
import { logUserLogout } from '../../../../lib/audit'
import prisma from '../../../../lib/database'

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken)
    }

    if (refreshToken) {
      // Revoke refresh token in database
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true }
      })
    }

    // Create response
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })

    // Clear session and refresh token cookies
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, clear the cookies
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
    return response
  }
} 