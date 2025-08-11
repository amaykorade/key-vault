import { NextResponse } from 'next/server';
import prisma from '../../../lib/database.js';
import { requirePermission, logAccess } from '../../../lib/permissions.js';
import { getCurrentUser } from '../../../lib/auth.js';
import { hasFeature, getUpgradeMessage } from '../../../lib/planLimits.js';

// Get all roles
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has RBAC features
    if (!hasFeature(user, 'rbac')) {
      const message = getUpgradeMessage(user, 'rbac');
      return NextResponse.json({ 
        error: 'RBAC features not available',
        message,
        feature: 'rbac',
        currentPlan: user.plan
      }, { status: 403 });
    }

    const roles = await prisma.roles.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: { permission: true }
        },
        _count: {
          select: { teamMembers: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json({ 
      success: true, 
      roles: roles.map(role => ({
        ...role,
        permissions: role.rolePermissions.map(rp => rp.permission.name),
        memberCount: role._count.teamMembers
      }))
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch roles' 
    }, { status: 500 });
  }
}

// Create a new role
export async function POST(request) {
  try {
    const { name, description, permissions } = await request.json();
    
    // Validate input
    if (!name || !description || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid input: name, description, and permissions array are required' 
      }, { status: 400 });
    }
    
    // Check if role name already exists
    const existingRole = await prisma.roles.findUnique({
      where: { name }
    });
    
    if (existingRole) {
      return NextResponse.json({ 
        success: false, 
        error: 'Role with this name already exists' 
      }, { status: 409 });
    }
    
    // Create role with permissions
    const role = await prisma.roles.create({
      data: {
        name,
        description,
        rolePermissions: {
          create: permissions.map(permissionName => ({
            permission: {
              connect: { name: permissionName }
            },
            grantedBy: 'system' // TODO: Get actual user ID from auth
          }))
        }
      },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });
    
    // Log the action
    await logAccess('system', 'role', role.id, 'create', 'success', {
      permissions,
      roleName: name
    });
    
    return NextResponse.json({ 
      success: true, 
      role: {
        ...role,
        permissions: role.rolePermissions.map(rp => rp.permission.name)
      }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create role' 
    }, { status: 500 });
  }
} 