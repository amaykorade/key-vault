import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getCurrentUser } from '../../../../lib/auth';
import prisma from '../../../../lib/database';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await request.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }
    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
    // Calculate subscription expiration (1 month from now)
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    // Update user plan and subscription expiration
            await prisma.users.update({
      where: { id: user.id },
      data: { 
        plan: plan.toUpperCase(),
        subscriptionExpiresAt: subscriptionEndDate
      },
    });

    // Store payment info with subscription dates
    await prisma.payments.create({
      data: {
        userId: user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        plan: plan.toUpperCase(),
        amount: parseInt(request.headers.get('x-razorpay-amount') || '0', 10),
        currency: request.headers.get('x-razorpay-currency') || 'USD',
        status: 'captured',
        subscriptionStartDate,
        subscriptionEndDate,
      }
    });
    return NextResponse.json({ success: true, message: 'Payment verified and plan upgraded.' });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
} 