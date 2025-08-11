import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth.js';
import { getAuditLogs } from '../../../lib/audit.js';
import { hasFeature } from '../../../lib/planLimits.js';

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
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const auditLogs = await getAuditLogs(user.id, {
      action,
      resource,
      startDate,
      endDate,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      auditLogs,
      pagination: {
        limit,
        offset,
        hasMore: auditLogs.length === limit
      }
    });

  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
} 