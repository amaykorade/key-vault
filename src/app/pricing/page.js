'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const PricingTier = ({ name, price, priceSuffix, description, features, highlighted = false, buttonText = "Get Started" }) => (
  <Card className={`h-full flex flex-col ${highlighted ? 'border-2 border-blue-500 shadow-lg scale-105 relative z-10' : 'border border-gray-200'}`}>
    <div className="p-8 flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
        <p className="text-gray-500 text-sm min-h-[40px]">{description}</p>
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-4xl font-extrabold text-gray-900">${price}</span>
          <span className="text-lg text-gray-500 ml-1">{priceSuffix}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" 
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
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <div className="mt-auto">
        <Button
          variant={highlighted ? 'primary' : 'outline'}
          size="lg"
          className="w-full font-semibold"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  </Card>
);

export default function PricingPage() {
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            All plans include: SSL encryption, unlimited API calls, and basic analytics
          </p>
        </div>
      </div>
    </div>
  );
} 