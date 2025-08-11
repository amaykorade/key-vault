import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'

export async function GET(request) {
  try {
    console.log('🔍 Test permissions route called');
    
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    console.log('👤 User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
    
    return NextResponse.json({
      message: 'Permissions test completed',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('❌ Test permissions error:', error)
    return NextResponse.json(
      { 
        message: 'Test permissions failed',
        error: error.message
      },
      { status: 500 }
    )
  }
} 