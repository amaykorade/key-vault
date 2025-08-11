import { NextResponse } from 'next/server';
import { getCurrentUser, createAPIToken } from '../../../../lib/auth.js';
import { logAccess } from '../../../../lib/permissions.js';
import prisma from '../../../../lib/database.js';

// Get user's API tokens
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const tokens = await prisma.api_tokens.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        permissions: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      tokens
    });
  } catch (error) {
    console.error('Error fetching API tokens:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch API tokens'
    }, { status: 500 });
  }
}

// Create new API token
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { name, permissions, expiresAt } = await request.json();
    
    // Validate permissions
    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json({
        success: false,
        error: 'Permissions array is required'
      }, { status: 400 });
    }

    // Create API token
    const apiToken = await createAPIToken(user.id, permissions, expiresAt);
    
    // Log token creation
    await logAccess(user.id, 'api_token', apiToken.id, 'create', 'success', {
      tokenName: name,
      permissions,
      expiresAt,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent')
    });

    return NextResponse.json({
      success: true,
      token: {
        id: apiToken.id,
        token: apiToken.token,
        name: apiToken.name,
        permissions: apiToken.permissions,
        expiresAt: apiToken.expiresAt,
        createdAt: apiToken.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating API token:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create API token'
    }, { status: 500 });
  }
} 