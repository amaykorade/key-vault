import { NextResponse } from 'next/server'
import { createUser, createSession } from '../../../../lib/auth'
import { logUserLogin } from '../../../../lib/audit'
import prisma from '../../../../lib/database'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const user = await createUser(email, password, name)

    // Create session
    const session = await createSession(user.id)

    // Create default folder for the user
    await prisma.folder.create({
      data: {
        name: 'General',
        description: 'Default folder for your keys',
        color: '#3B82F6',
        userId: user.id
      }
    })

    // Log the signup/login
    await logUserLogin(user.id, {
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent')
    })

    // Create response with session cookie
    const response = NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      session: {
        token: session.token,
        expiresAt: session.expiresAt
      }
    })

    // Set secure HTTP-only cookie
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 