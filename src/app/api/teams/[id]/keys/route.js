import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../../../lib/auth.js';

const prisma = new PrismaClient();

// POST /api/teams/[id]/keys - Grant key access to team
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId } = params;
    const { keyId, permissions = ['READ'] } = await request.json();

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json({ error: 'At least one permission is required' }, { status: 400 });
    }

    // Check if user is team owner or admin
    const team = await prisma.team.findFirst({
      where: { id: teamId },
      include: {
        members: {
          where: { userId: user.id }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.ownerId === user.id;
    const isAdmin = team.members.some(member => 
      member.userId === user.id && member.role === 'ADMIN'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if key exists and user owns it
    const key = await prisma.key.findFirst({
      where: { id: keyId, userId: user.id }
    });

    if (!key) {
      return NextResponse.json({ error: 'Key not found or access denied' }, { status: 404 });
    }

    // Check if access already exists
    const existingAccess = await prisma.keyAccess.findUnique({
      where: {
        keyId_teamId: {
          keyId,
          teamId
        }
      }
    });

    if (existingAccess) {
      return NextResponse.json({ error: 'Team already has access to this key' }, { status: 400 });
    }

    // Grant access
    const keyAccess = await prisma.keyAccess.create({
      data: {
        keyId,
        teamId,
        permissions,
        grantedBy: user.id
      },
      include: {
        key: {
          select: { id: true, name: true, description: true, type: true }
        },
        team: {
          select: { id: true, name: true }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'SHARE',
        resource: 'key_access',
        resourceId: keyAccess.id,
        userId: user.id,
        details: { 
          keyId, 
          keyName: key.name,
          teamId, 
          teamName: team.name,
          permissions 
        }
      }
    });

    return NextResponse.json({ keyAccess }, { status: 201 });
  } catch (error) {
    console.error('Error granting key access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/teams/[id]/keys - Revoke key access from team
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId } = params;
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    // Check if user is team owner or admin
    const team = await prisma.team.findFirst({
      where: { id: teamId },
      include: {
        members: {
          where: { userId: user.id }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.ownerId === user.id;
    const isAdmin = team.members.some(member => 
      member.userId === user.id && member.role === 'ADMIN'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get key access to revoke
    const keyAccess = await prisma.keyAccess.findFirst({
      where: {
        keyId,
        teamId
      },
      include: {
        key: {
          select: { id: true, name: true }
        },
        team: {
          select: { id: true, name: true }
        }
      }
    });

    if (!keyAccess) {
      return NextResponse.json({ error: 'Key access not found' }, { status: 404 });
    }

    // Check if user owns the key or granted the access
    if (keyAccess.grantedBy !== user.id) {
      const key = await prisma.key.findFirst({
        where: { id: keyId, userId: user.id }
      });
      
      if (!key) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Revoke access
    await prisma.keyAccess.delete({
      where: { id: keyAccess.id }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'REVOKE',
        resource: 'key_access',
        resourceId: keyAccess.id,
        userId: user.id,
        details: { 
          keyId, 
          keyName: keyAccess.key.name,
          teamId, 
          teamName: keyAccess.team.name
        }
      }
    });

    return NextResponse.json({ message: 'Key access revoked successfully' });
  } catch (error) {
    console.error('Error revoking key access:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 