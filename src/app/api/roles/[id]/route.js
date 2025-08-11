import { NextResponse } from 'next/server';
import prisma from '../../../../lib/database.js';
import { logAccess } from '../../../../lib/permissions.js';

// Get a specific role
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const role = await prisma.roles.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true }
        },
        teamMembers: {
          include: {
            users: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { teamMembers: true }
        }
      }
    });
    
    if (!role) {
      return NextResponse.json({ 
        success: false, 
        error: 'Role not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      role: {
        ...role,
        permissions: role.rolePermissions.map(rp => rp.permission.name),
        memberCount: role._count.teamMembers,
        members: role.teamMembers.map(tm => ({
          id: tm.users.id,
          name: tm.users.name,
          email: tm.users.email,
          joinedAt: tm.joinedAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch role' 
    }, { status: 500 });
  }
}

// Update a role
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, description, permissions } = await request.json();
    
    // Check if role exists
    const existingRole = await prisma.roles.findUnique({
      where: { id }
    });
    
    if (!existingRole) {
      return NextResponse.json({ 
        success: false, 
        error: 'Role not found' 
      }, { status: 404 });
    }
    
    // Prevent modification of system roles
    if (existingRole.isSystem) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot modify system roles' 
      }, { status: 403 });
    }
    
    // Check if new name conflicts with existing role
    if (name && name !== existingRole.name) {
      const nameConflict = await prisma.roles.findUnique({
        where: { name }
      });
      
      if (nameConflict) {
        return NextResponse.json({ 
          success: false, 
          error: 'Role with this name already exists' 
        }, { status: 409 });
      }
    }
    
    // Update role
    const updatedRole = await prisma.roles.update({
      where: { id },
      data: {
        name: name || existingRole.name,
        description: description || existingRole.description,
        rolePermissions: permissions ? {
          deleteMany: {},
          create: permissions.map(permissionName => ({
            permission: {
              connect: { name: permissionName }
            },
            grantedBy: 'system' // TODO: Get actual user ID from auth
          }))
        } : undefined
      },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });
    
    // Log the action
    await logAccess('system', 'role', id, 'update', 'success', {
      oldName: existingRole.name,
      newName: updatedRole.name,
      permissions
    });
    
    return NextResponse.json({ 
      success: true, 
      role: {
        ...updatedRole,
        permissions: updatedRole.rolePermissions.map(rp => rp.permission.name)
      }
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update role' 
    }, { status: 500 });
  }
}

// Delete a role
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if role exists
    const existingRole = await prisma.roles.findUnique({
      where: { id },
      include: {
        _count: {
          select: { teamMembers: true }
        }
      }
    });
    
    if (!existingRole) {
      return NextResponse.json({ 
        success: false, 
        error: 'Role not found' 
      }, { status: 404 });
    }
    
    // Prevent deletion of system roles
    if (existingRole.isSystem) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete system roles' 
      }, { status: 403 });
    }
    
    // Check if role is assigned to any team members
    if (existingRole._count.teamMembers > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete role that is assigned to team members' 
      }, { status: 409 });
    }
    
    // Delete role (cascade will handle role_permissions)
    await prisma.roles.delete({
      where: { id }
    });
    
    // Log the action
    await logAccess('system', 'role', id, 'delete', 'success', {
      roleName: existingRole.name
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Role deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete role' 
    }, { status: 500 });
  }
} 