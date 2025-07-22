import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getCurrentUser } from '../../../../lib/auth';

const plans = {
  pro: { amount: 9 * 100, currency: 'USD', description: 'Pro Plan Subscription' },
  team: { amount: 29 * 100, currency: 'USD', description: 'Team Plan Subscription' },
};

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
    const { plan } = await request.json();
    if (!plans[plan]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }
    const planDetails = plans[plan];
    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: planDetails.currency,
      receipt: `rcpt_${user.id.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
      notes: {
        userId: user.id,
        plan,
      },
    });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
