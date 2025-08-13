import { NextResponse } from 'next/server'
import prisma from '../../../../lib/database'

export async function GET(request) {
  try {
    // Simple API token authentication only
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Valid API token required' },
        { status: 401 }
      )
    }

    const apiToken = authHeader.substring(7)
    
    // Simple token validation
    const tokenRecord = await prisma.api_tokens.findFirst({
      where: { 
        token: apiToken,
        isActive: true
      }
    })

    if (!tokenRecord) {
      return NextResponse.json(
        { message: 'Invalid API token' },
        { status: 401 }
      )
    }

    // Get user data
    const user = await prisma.users.findUnique({
      where: { id: tokenRecord.userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      )
    }

    // Return basic user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan || 'FREE'
      }
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 