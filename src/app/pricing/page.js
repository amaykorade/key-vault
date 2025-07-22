'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingTier = ({ name, price, priceSuffix, description, features, highlighted = false, buttonText = "Get Started", onUpgrade, isPaid }) => (
  <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-xl ${highlighted ? 'border-2 border-blue-500 shadow-xl scale-105 relative z-10 bg-gradient-to-b from-gray-700 to-gray-800' : 'border border-gray-600 hover:border-gray-500'}`}>
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        {highlighted && (
          <div className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-4">
            Most Popular
          </div>
        )}
        <h3 className="text-xl font-bold mb-3 text-white">{name}</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-white">${price}</span>
          <span className="text-sm text-gray-400 ml-1">{priceSuffix}</span>
        </div>
      </div>
      {/* Features */}
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                className="h-4 w-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Button */}
      <div className="mt-auto">
        {isPaid ? (
          <Button
            variant={highlighted ? 'primary' : 'outline'}
            size="md"
            className="w-full font-medium"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
        ) : (
          <Button
            variant={highlighted ? 'primary' : 'outline'}
            size="md"
            className="w-full font-medium"
            disabled
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default function PricingPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan) => {
    setMessage('');
    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setMessage('Failed to load Razorpay. Please try again.');
      setLoading(false);
      return;
    }
    try {
      // Create order
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan })
      });
      const { order, error } = await orderRes.json();
      if (!order) throw new Error(error || 'Failed to create order');
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Key Vault',
        description: order.notes.plan.charAt(0).toUpperCase() + order.notes.plan.slice(1) + ' Plan',
        order_id: order.id,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-razorpay-amount': order.amount,
              'x-razorpay-currency': order.currency
            },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setMessage('Payment successful! Your plan has been upgraded.');
          } else {
            setMessage('Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        theme: { color: '#3B82F6' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setMessage(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pricingTiers = [
    {
      name: 'Free',
      price: '0',
      priceSuffix: '/mo',
      description: 'Indie hackers, hobbyists',
      features: [
        '1 project',
        '5 secrets',
        'SDK access',
        'Basic UI dashboard',
        'Community support'
      ],
      isPaid: false
    },
    {
      name: 'Pro',
      price: '9',
      priceSuffix: '/mo',
      highlighted: true,
      description: 'Small teams, solopreneurs',
      features: [
        '3 projects',
        '100 secrets',
        'Audit logs',
        'Expiring secrets',
        'API analytics',
        'Email support'
      ],
      isPaid: true,
      onUpgrade: () => handleUpgrade('pro')
    },
    {
      name: 'Team',
      price: '29',
      priceSuffix: '/mo/team',
      description: 'Growing teams / SaaS',
      features: [
        'Unlimited projects',
        '1,000+ secrets',
        'Team members',
        'RBAC (roles & permissions)',
        'SDK token rotation',
        'Priority support'
      ],
      isPaid: true,
      onUpgrade: () => handleUpgrade('team')
    }
  ];

  return (
    <div className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white sm:text-4xl mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that best fits your needs. Start free, upgrade when you need more.
          </p>
        </div>
        {message && (
          <div className="mb-8 text-center text-lg text-green-600 font-semibold">{message}</div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            All plans include: SSL encryption, unlimited API calls, and basic analytics
          </p>
        </div>
      </div>
    </div>
  );
} 