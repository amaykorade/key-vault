import { NextResponse } from 'next/server'
import { createSession, createRefreshToken } from '../../../lib/auth'
import prisma from '../../../lib/database'

export async function POST(request) {
  try {
    const { userId } = await request.json()

    console.log('Testing session creation for user:', userId);

    // Test session creation
    try {
      const session = await createSession(userId)
      console.log('Session created:', session.id);
    } catch (error) {
      console.error('Session creation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Session creation failed: ' + error.message
      }, { status: 500 })
    }

    // Test refresh token creation
    try {
      const refreshToken = await createRefreshToken(userId)
      console.log('Refresh token created:', refreshToken.id);
    } catch (error) {
      console.error('Refresh token creation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Refresh token creation failed: ' + error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Session and refresh token creation successful'
    })

  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 