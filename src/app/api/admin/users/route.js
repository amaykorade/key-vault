import { NextResponse } from 'next/server'
import { validateSession } from '../../../../lib/auth'
import prisma from '../../../../lib/database'

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Validate session and check if user is admin
    const user = await validateSession(sessionToken)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            keys: true,
            folders: true,
            sessions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 