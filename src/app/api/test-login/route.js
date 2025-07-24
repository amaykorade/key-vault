import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/database'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    console.log('Testing login for:', email);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    console.log('User found:', user.id);

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 })
    }

    console.log('Password verified successfully');

    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 