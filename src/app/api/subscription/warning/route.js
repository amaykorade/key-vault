import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../../lib/auth.js';

const prisma = new PrismaClient();

// GET /api/subscription/warning - Get subscription warning status
export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: {
        plan: true,
        subscriptionExpiresAt: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only show warnings for paid plans
    if (currentUser.plan === 'FREE') {
      return NextResponse.json({ warning: null });
    }

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    // Check if subscription is expired
    if (!hasActiveSubscription) {
      return NextResponse.json({
        warning: {
          type: 'expired',
          message: 'Your subscription has expired. Renew now to continue accessing your keys and projects.',
          daysUntilExpiry: 0,
          expiresAt: currentUser.subscriptionExpiresAt
        }
      });
    }

    // Calculate days until expiry
    const daysUntilExpiry = Math.ceil((currentUser.subscriptionExpiresAt - now) / (1000 * 60 * 60 * 24));

    // Show warning if expiring within 3 days
    if (daysUntilExpiry <= 3) {
      let warningType = 'expiring_soon';
      let message = `Your subscription expires in ${daysUntilExpiry} days. Renew now to avoid service interruption.`;

      if (daysUntilExpiry === 0) {
        warningType = 'expiring_today';
        message = 'Your subscription expires today! Renew now to maintain access to your keys and projects.';
      } else if (daysUntilExpiry === 1) {
        warningType = 'expiring_today';
        message = 'Your subscription expires tomorrow! Renew now to maintain access to your keys and projects.';
      }

      return NextResponse.json({
        warning: {
          type: warningType,
          message,
          daysUntilExpiry,
          expiresAt: currentUser.subscriptionExpiresAt
        }
      });
    }

    // No warning needed
    return NextResponse.json({ warning: null });

  } catch (error) {
    console.error('Error fetching subscription warning:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscription/warning - Dismiss warning
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dismiss } = await request.json();

    if (dismiss) {
      // Create audit log for warning dismissal
      await prisma.audit_logs.create({
        data: {
          action: 'UPDATE',
          resource: 'subscription_warning',
          resourceId: user.id,
          userId: user.id,
          details: {
            action: 'warning_dismissed',
            dismissedAt: new Date()
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Warning dismissed successfully' 
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error) {
    console.error('Error dismissing subscription warning:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 