import { NextResponse } from 'next/server'
import { validateSession } from '../../../../lib/auth'

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Validate session
    const user = await validateSession(sessionToken)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 