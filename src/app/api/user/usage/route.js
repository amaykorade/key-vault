import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth.js';
import { getUserUsageStats } from '../../../../lib/planMiddleware.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getUserUsageStats(user.id);
    
    if (!usage) {
      return NextResponse.json({ error: 'Usage data not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      usage 
    });

  } catch (error) {
    console.error('Error fetching user usage:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 