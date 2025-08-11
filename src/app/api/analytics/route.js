import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth.js';
import { getAuditStats } from '../../../lib/audit.js';
import { hasFeature } from '../../../lib/planLimits.js';
import prisma from '../../../lib/database.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has API analytics feature (PRO+ plans)
    if (!hasFeature(user, 'apiAnalytics')) {
      return NextResponse.json(
        { 
          error: 'API Analytics requires PRO plan or higher',
          upgradeRequired: true,
          currentPlan: user.plan
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // Default to 30 days ago
    const endDate = searchParams.get('endDate') || new Date().toISOString();

    // Get audit statistics
    const auditStats = await getAuditStats(user.id, startDate, endDate);

    // Get key usage statistics
    const keyStats = await prisma.keys.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _count: true
    });

    // Get API token usage
    const apiTokenUsage = await prisma.audit_logs.count({
      where: {
        userId: user.id,
        action: 'READ',
        resource: 'key',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    });

    // Get recent activity
    const recentActivity = await prisma.audit_logs.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Calculate daily activity for the last 30 days
    const dailyActivity = await prisma.audit_logs.groupBy({
      by: ['createdAt'],
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      _count: true
    });

    return NextResponse.json({
      success: true,
      analytics: {
        period: {
          startDate,
          endDate
        },
        auditStats,
        keyStats: keyStats.reduce((acc, stat) => {
          acc[stat.type] = stat._count;
          return acc;
        }, {}),
        apiTokenUsage,
        recentActivity,
        dailyActivity: dailyActivity.map(day => ({
          date: day.createdAt.toISOString().split('T')[0],
          count: day._count
        }))
      }
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 