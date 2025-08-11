import { NextResponse } from 'next/server';
import prisma from '../../../../lib/database.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const result = searchParams.get('result');
    const resourceType = searchParams.get('resourceType');

    // Build where clause
    const where = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (result) {
      where.result = result;
    }
    
    if (resourceType) {
      where.resourceType = resourceType;
    }

    // Get audit logs with user information
    const logs = await prisma.access_audit_logs.findMany({
      where,
      include: {
        user: {
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
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await prisma.access_audit_logs.count({ where });

    return NextResponse.json({ 
      success: true, 
      logs,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch audit logs' 
    }, { status: 500 });
  }
} 