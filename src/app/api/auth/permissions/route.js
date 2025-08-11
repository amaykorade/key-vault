import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth.js';
import { PermissionManager } from '../../../../lib/permissions.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Create permission manager for the user
    const pm = new PermissionManager(user);
    await pm.loadPermissions();

    // Get user's permissions
    const permissions = pm.getPermissionsList();

    return NextResponse.json({
      success: true,
      permissions,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch permissions'
    }, { status: 500 });
  }
} 