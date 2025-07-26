import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '../../../../lib/database';

export async function POST(request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: 'Missing webhook secret or signature' }, { status: 400 });
    }
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }
    const event = JSON.parse(rawBody);
    // Handle payment.captured and order.paid
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity || event.payload?.order?.entity;
      const notes = paymentEntity?.notes || {};
      const userId = notes.userId;
      const plan = notes.plan;
      if (userId && plan) {
        // Update user plan
        await prisma.users.update({
          where: { id: userId },
          data: { plan: plan.toUpperCase() },
        });
        // Store payment info (idempotent)
        await prisma.payments.upsert({
          where: { paymentId: paymentEntity.id },
          update: {
            status: paymentEntity.status,
            amount: paymentEntity.amount,
            currency: paymentEntity.currency,
            plan: plan.toUpperCase(),
          },
          create: {
            userId,
            orderId: paymentEntity.order_id,
            paymentId: paymentEntity.id,
            signature: signature,
            plan: plan.toUpperCase(),
            amount: paymentEntity.amount,
            currency: paymentEntity.currency,
            status: paymentEntity.status,
          }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
} 