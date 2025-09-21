import { NextResponse } from 'next/server';
import prisma from '../../../../lib/database.js';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    // Use hardcoded redirect URI for production to avoid env issues
    const isProduction = process.env.NODE_ENV === 'production';
    const redirectUri = isProduction 
      ? 'https://key-vault-chi.vercel.app/auth/google/callback'
      : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/google/callback`;
    console.log('🔍 Debug - Redirect URI being sent to Google:', redirectUri);
    console.log('🔍 Debug - NEXTAUTH_URL env var:', process.env.NEXTAUTH_URL);
    console.log('🔍 Debug - NODE_ENV:', process.env.NODE_ENV);
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Google token error:', tokenData);
      return NextResponse.json(
        { message: 'Failed to get access token' },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Google user info error:', userData);
      return NextResponse.json(
        { message: 'Failed to get user info' },
        { status: 400 }
      );
    }

    // Check if user exists in our database
    let user = await prisma.users.findUnique({
      where: { email: userData.email }
    });

    if (!user) {
      return NextResponse.json(
        { 
          message: 'Account not found. Please sign up first.',
          requiresSignup: true,
          email: userData.email,
          name: userData.name
        },
        { status: 404 }
      );
    }

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
    console.error('Google auth error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 