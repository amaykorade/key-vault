import { NextResponse } from 'next/server'
import { deleteSession } from '../../../../lib/auth'
import { logUserLogout } from '../../../../lib/audit'

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken)
    }

    // Create response
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })

    // Clear session cookie
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    // Even if there's an error, clear the cookie
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

    return response
  }
} 