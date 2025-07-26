import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/auth.js';

const prisma = new PrismaClient();

// GET /api/subscription - Get current subscription status
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

    const now = new Date();
    const isActive = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;
    const daysUntilExpiry = currentUser.subscriptionExpiresAt 
      ? Math.ceil((currentUser.subscriptionExpiresAt - now) / (1000 * 60 * 60 * 24))
      : 0;

    const subscription = {
      plan: currentUser.plan,
      isActive,
      expiresAt: currentUser.subscriptionExpiresAt,
      daysUntilExpiry,
      lastPayment: null
    };

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscription/renew - Renew subscription
export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !['PRO', 'TEAM'].includes(plan.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Check if user already has an active subscription
    const currentUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: { subscriptionExpiresAt: true }
    });

    const now = new Date();
    const hasActiveSubscription = currentUser.subscriptionExpiresAt && currentUser.subscriptionExpiresAt > now;

    // Calculate new expiration date
    let newExpirationDate;
    if (hasActiveSubscription) {
      // Extend from current expiration date
      newExpirationDate = new Date(currentUser.subscriptionExpiresAt);
      newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
    } else {
      // Start from now
      newExpirationDate = new Date();
      newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
    }

    // Update user subscription
    await prisma.users.update({
      where: { id: user.id },
      data: {
        plan: plan.toUpperCase(),
        subscriptionExpiresAt: newExpirationDate
      }
    });

    // Create a renewal payment record (without actual payment for now)
    await prisma.payments.create({
      data: {
        userId: user.id,
        orderId: `renewal_${Date.now()}`,
        paymentId: `renewal_${Date.now()}`,
        signature: 'renewal',
        plan: plan.toUpperCase(),
        amount: plan.toUpperCase() === 'PRO' ? 900 : 2900, // $9 or $29 in cents
        currency: 'USD',
        status: 'renewal',
        subscriptionStartDate: hasActiveSubscription ? currentUser.subscriptionExpiresAt : now,
        subscriptionEndDate: newExpirationDate
      }
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        action: 'UPDATE',
        resource: 'subscription',
        resourceId: user.id,
        userId: user.id,
        details: { 
          plan: plan.toUpperCase(),
          newExpirationDate,
          isRenewal: hasActiveSubscription
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription renewed successfully',
      subscription: {
        plan: plan.toUpperCase(),
        expiresAt: newExpirationDate,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error renewing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 