import { NextResponse } from 'next/server';
import prisma from '../../../../lib/database.js';

export async function GET(request) {
  try {
    // Get counts from database
    const [
      totalUsers,
      totalRoles,
      totalPermissions,
      recentAccess
    ] = await Promise.all([
      prisma.users.count({ where: { isActive: true } }),
      prisma.roles.count({ where: { isActive: true } }),
      prisma.permissions.count(),
      prisma.access_audit_logs.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalRoles,
      totalPermissions,
      recentAccess
    };

    return NextResponse.json({ 
      success: true, 
      stats 
    });
  } catch (error) {
    console.error('Error fetching RBAC stats:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch stats' 
    }, { status: 500 });
  }
} 