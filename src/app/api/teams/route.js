import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/auth.js';

const prisma = new PrismaClient();

// GET /api/teams - List user's teams
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teams where user is owner or member
    const teams = await prisma.teams.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { team_members: { some: { userId: user.id } } }
        ]
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        },
        team_members: {
          include: {
            users: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { team_members: true, key_accesses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/teams - Create a new team
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    // Check if user has TEAM plan with active subscription
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { plan: true, subscriptionExpiresAt: true }
    });

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    if (currentUser.plan !== 'TEAM' || !hasActiveSubscription) {
      return NextResponse.json({ 
        error: 'Team functionality requires an active TEAM plan subscription. Please upgrade your plan.' 
      }, { status: 403 });
    }

          const team = await prisma.teams.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        ownerId: user.id
      },
      include: {
        users: {
          select: { id: true, name: true, email: true }
        },
        team_members: {
          include: {
            users: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    // Create audit log
          await prisma.audit_logs.create({
      data: {
        action: 'CREATE',
        resource: 'team',
        resourceId: team.id,
        userId: user.id,
        details: { teamName: team.name }
      }
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 