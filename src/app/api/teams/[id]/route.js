import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../../lib/auth.js';

const prisma = new PrismaClient();

// GET /api/teams/[id] - Get team details
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const team = await prisma.team.findFirst({
      where: {
        id,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        keyAccesses: {
          include: {
            key: {
              select: { id: true, name: true, description: true, type: true }
            }
          }
        },
        _count: {
          select: { members: true, keyAccesses: true }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/teams/[id] - Update team
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { name, description } = await request.json();

    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: { id, ownerId: user.id }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found or access denied' }, { status: 404 });
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name: name?.trim(),
        description: description?.trim()
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'team',
        resourceId: team.id,
        userId: user.id,
        details: { teamName: updatedTeam.name }
      }
    });

    return NextResponse.json({ team: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/teams/[id] - Delete team
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if user is team owner
    const team = await prisma.team.findFirst({
      where: { id, ownerId: user.id }
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found or access denied' }, { status: 404 });
    }

    // Delete team (cascades to members and key accesses)
    await prisma.team.delete({
      where: { id }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'team',
        resourceId: team.id,
        userId: user.id,
        details: { teamName: team.name }
      }
    });

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 