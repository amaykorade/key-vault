import { NextResponse } from 'next/server'
import { createUser, createSession, createRefreshToken } from '../../../../lib/auth'
import { logUserLogin } from '../../../../lib/audit'
import prisma from '../../../../lib/database'

export async function POST(request) {
  try {
    console.log('🔍 Signup route called');
    
    const { name, email, password } = await request.json()
    console.log('📝 Signup data received:', { name, email, hasPassword: !!password });

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user
    console.log('👤 Creating user...');
    const user = await createUser(email, password, name)
    console.log('✅ User created:', user.id);

    // Create session
    console.log('🔐 Creating session...');
    const session = await createSession(user.id)
    console.log('✅ Session created');
    
    // Create refresh token
    console.log('🔄 Creating refresh token...');
    const refreshToken = await createRefreshToken(user.id)
    console.log('✅ Refresh token created');

    // Create default folder for the user
    console.log('📁 Creating default folder...');
    await prisma.folders.create({
      data: {
        name: 'General',
        description: 'Default folder for your keys',
        color: '#3B82F6',
        userId: user.id
      }
    })
    console.log('✅ Default folder created');

    // Log the signup/login
    console.log('📝 Logging user login...');
    try {
      await logUserLogin(user.id, {
        ipAddress: request.headers.get('x-forwarded-for') || request.ip,
        userAgent: request.headers.get('user-agent')
      })
      console.log('✅ User login logged');
    } catch (auditError) {
      console.error('⚠️ Audit logging failed (non-critical):', auditError);
      // Don't fail signup if audit logging fails
    }

    // Create response with session and refresh token cookies
    console.log('🍪 Setting cookies...');
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
      },
      refreshToken: {
        expiresAt: refreshToken.expiresAt
      }
    })

    // Set secure HTTP-only cookies
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })
    response.cookies.set('refresh_token', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })

    console.log('✅ Signup completed successfully');
    return response

  } catch (error) {
    console.error('❌ Signup error:', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    
    // Return more specific error information in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          message: 'Internal server error',
          error: error.message,
          stack: error.stack
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 