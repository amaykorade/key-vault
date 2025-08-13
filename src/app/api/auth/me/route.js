import { NextResponse } from 'next/server'
import { validateSession } from '../../../../lib/auth'
import prisma from '../../../../lib/database'

export async function GET(request) {
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
          return NextResponse.json(
            { message: 'API token expired' },
            { status: 401 }
          )
        }

        // Update last used timestamp
        await prisma.api_tokens.update({
          where: { id: tokenRecord.id },
          data: { lastUsedAt: new Date() }
        })

        user = tokenRecord.users
        
        // ADD PERMISSIONS: Load permissions based on user role for API tokens
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

    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        permissions: user.permissions || []
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