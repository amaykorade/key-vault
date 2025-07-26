import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../../../lib/auth.js';

const prisma = new PrismaClient();

// POST /api/teams/[id]/members - Add member to team
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId } = params;
    const { email, role = 'MEMBER' } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user is team owner or admin
    const team = await prisma.teams.findFirst({
      where: { id: teamId },
      include: {
        team_team_members: {
          where: { userId: user.id },
          include: { users: true }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.ownerId === user.id;
    const isAdmin = team.team_members.some(member => 
      member.userId === user.id && member.role === 'ADMIN'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Find user by email
          const targetUser = await prisma.users.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.team_members.findUnique({
      where: {
        userId_teamId: {
          userId: targetUser.id,
          teamId
        }
      }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
    }

    // Add member to team
    const member = await prisma.team_members.create({
      data: {
        userId: targetUser.id,
        teamId,
        role,
        invitedBy: user.id
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        action: 'CREATE',
        resource: 'team_member',
        resourceId: member.id,
        userId: user.id,
        details: { 
          teamId, 
          memberEmail: targetUser.email,
          role 
        }
      }
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/teams/[id]/members - Remove member from team
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId } = params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    // Check if user is team owner or admin
    const team = await prisma.teams.findFirst({
      where: { id: teamId },
      include: {
        team_members: {
          where: { userId: user.id }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isOwner = team.ownerId === user.id;
    const isAdmin = team.team_members.some(member => 
      member.userId === user.id && member.role === 'ADMIN'
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get member to remove
    const memberToRemove = await prisma.team_members.findFirst({
      where: {
        id: memberId,
        teamId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!memberToRemove) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent removing team owner
    if (memberToRemove.userId === team.ownerId) {
      return NextResponse.json({ error: 'Cannot remove team owner' }, { status: 400 });
    }

    // Prevent removing yourself if you're not the owner
    if (memberToRemove.userId === user.id && !isOwner) {
      return NextResponse.json({ error: 'Cannot remove yourself' }, { status: 400 });
    }

    // Remove member
    await prisma.team_members.delete({
      where: { id: memberId }
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        action: 'DELETE',
        resource: 'team_member',
        resourceId: memberId,
        userId: user.id,
        details: { 
          teamId, 
          memberEmail: memberToRemove.user.email,
          memberRole: memberToRemove.role 
        }
      }
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 