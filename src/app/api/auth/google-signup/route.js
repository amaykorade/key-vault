import { NextResponse } from 'next/server';
import prisma from '../../../../lib/database.js';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { message: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const user = await prisma.users.create({
      data: {
        email,
        name,
        password: '', // Google users don't need password
        role: 'USER',
        plan: 'FREE'
      }
    });

    // Create default folder for new Google OAuth users
    await prisma.folders.create({
      data: {
        name: 'General',
        description: 'Default folder for your keys',
        color: '#3B82F6',
        userId: user.id
      }
    });

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.sessions.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt
      }
    });

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan
      }
    });

    // Set session cookie
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    return response;

  } catch (error) {
    console.error('Google OAuth signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 