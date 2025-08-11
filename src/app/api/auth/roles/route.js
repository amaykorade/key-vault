import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth.js';
import prisma from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get user's roles from team memberships
    const teamMemberships = await prisma.team_members.findMany({
      where: {
        userId: user.id
      },
      include: {
        roles: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        },
        teams: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Format roles for response
    const roles = teamMemberships.map(membership => ({
      id: membership.roles?.id || null,
      name: membership.roles?.name || 'No Role',
      description: membership.roles?.description || 'No role assigned',
      teamId: membership.teamId,
      teamName: membership.teams.name,
      role: membership.role, // OWNER, ADMIN, MEMBER
      permissions: membership.roles?.rolePermissions?.map(rp => rp.permission.name) || [],
      customPermissions: membership.customPermissions || [],
      joinedAt: membership.joinedAt,
      acceptedAt: membership.acceptedAt
    }));

    // Add user's default role if no team roles
    if (roles.length === 0) {
      roles.push({
        id: null,
        name: user.role,
        description: `Default ${user.role} role`,
        teamId: null,
        teamName: null,
        role: 'USER',
        permissions: [],
        customPermissions: user.permissions || [],
        joinedAt: user.createdAt,
        acceptedAt: user.createdAt
      });
    }

    return NextResponse.json({
      success: true,
      roles,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch roles'
    }, { status: 500 });
  }
} 