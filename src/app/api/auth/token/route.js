import { NextResponse } from 'next/server';
import { getCurrentUser, createJWTToken } from '../../../../lib/auth.js';
import { logAccess } from '../../../../lib/permissions.js';

// Generate JWT token with permissions
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { teamId } = await request.json();
    
    // Generate JWT token with embedded permissions
    const token = await createJWTToken(user, teamId);
    
    // Log token generation
    await logAccess(user.id, 'auth', null, 'token_generated', 'success', {
      tokenType: 'JWT',
      teamId,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent')
    });

    return NextResponse.json({
      success: true,
      token,
      expiresIn: '24h',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate token'
    }, { status: 500 });
  }
} 