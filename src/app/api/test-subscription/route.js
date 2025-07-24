import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth.js'
import prisma from '../../../lib/database'

export async function GET(request) {
  try {
    console.log('Testing subscription API...');
    
    // Test getCurrentUser
    const user = await getCurrentUser(request);
    console.log('User from getCurrentUser:', user ? user.id : 'null');
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Test user query
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        plan: true,
        subscriptionExpiresAt: true
      }
    });

    console.log('User from database:', currentUser);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const isActive = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;
    const daysUntilExpiry = currentUser.subscriptionExpiresAt 
      ? Math.ceil((currentUser.subscriptionExpiresAt - now) / (1000 * 60 * 60 * 24))
      : 0;

    const subscription = {
      plan: currentUser.plan,
      isActive,
      expiresAt: currentUser.subscriptionExpiresAt,
      daysUntilExpiry
    };

    return NextResponse.json({ 
      success: true,
      subscription,
      user: {
        id: currentUser.id,
        email: currentUser.email
      }
    });
    
  } catch (error) {
    console.error('Subscription test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 