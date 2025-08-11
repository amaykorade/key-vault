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
    
    // Test the exact permission check logic from the keys route
    console.log('🔍 Testing permission check logic...');
    
    const hasKeysWrite = user.permissions && Array.isArray(user.permissions) && user.permissions.includes('keys:write');
    const hasWildcard = user.permissions && Array.isArray(user.permissions) && user.permissions.includes('*');
    
    console.log('🔍 Permission check results:', {
      hasPermissions: !!user.permissions,
      isArray: Array.isArray(user.permissions),
      permissionsLength: user.permissions ? user.permissions.length : 0,
      hasKeysWrite: hasKeysWrite,
      hasWildcard: hasWildcard,
      wouldPass: hasKeysWrite || hasWildcard
    });
    
    // Test the exact condition from the keys route
    const condition = !user.permissions.includes('keys:write') && !user.permissions.includes('*');
    console.log('🔍 Keys route condition result:', {
      condition: condition,
      wouldBeDenied: condition
    });
    
    return NextResponse.json({
      message: 'Permissions test completed',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      },
      permissionCheck: {
        hasPermissions: !!user.permissions,
        isArray: Array.isArray(user.permissions),
        permissionsLength: user.permissions ? user.permissions.length : 0,
        hasKeysWrite: hasKeysWrite,
        hasWildcard: hasWildcard,
        wouldPass: hasKeysWrite || hasWildcard,
        keysRouteCondition: condition,
        wouldBeDenied: condition
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