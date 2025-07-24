'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription', {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription');
      }

      setSubscription(data.subscription);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewal = async (plan) => {
    try {
      setRenewing(true);
      setError(null);

      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to renew subscription');
      }

      // Refresh subscription data
      await fetchSubscription();
    } catch (error) {
      setError(error.message);
    } finally {
      setRenewing(false);
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'FREE': return 'bg-gray-600';
      case 'PRO': return 'bg-blue-600';
      case 'TEAM': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getPlanFeatures = (plan) => {
    switch (plan) {
      case 'FREE':
        return ['1 project', '5 secrets', 'Basic UI dashboard'];
      case 'PRO':
        return ['3 projects', '100 secrets', 'Audit logs', 'API analytics'];
      case 'TEAM':
        return ['Unlimited projects', '1,000+ secrets', 'Team members', 'RBAC'];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-600">
        <div className="text-red-400 mb-2">Error loading subscription</div>
        <div className="text-gray-400 text-sm">{error}</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Subscription Status</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${getPlanColor(subscription.plan)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
              {subscription.plan} PLAN
            </span>
            {subscription.isActive ? (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                ACTIVE
              </span>
            ) : (
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                EXPIRED
              </span>
            )}
          </div>
        </div>
      </div>

      {subscription.isActive && subscription.expiresAt && (
        <div className="mb-4">
          <div className="text-gray-400 text-sm mb-1">Expires on</div>
          <div className="text-white font-medium">
            {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          {subscription.daysUntilExpiry > 0 && (
            <div className="text-sm text-gray-400 mt-1">
              {subscription.daysUntilExpiry} day{subscription.daysUntilExpiry !== 1 ? 's' : ''} remaining
            </div>
          )}
        </div>
      )}

      {!subscription.isActive && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <div className="text-red-200 text-sm">
            Your subscription has expired. Renew to continue using premium features.
          </div>
        </div>
      )}

      {subscription.daysUntilExpiry <= 7 && subscription.daysUntilExpiry > 0 && (
        <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <div className="text-yellow-200 text-sm">
            Your subscription expires soon. Consider renewing to avoid service interruption.
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-gray-400 text-sm mb-2">Current Plan Features:</div>
        <ul className="space-y-1">
          {getPlanFeatures(subscription.plan).map((feature, index) => (
            <li key={index} className="text-white text-sm flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {subscription.plan !== 'FREE' && (
        <div className="space-y-2">
          <Button
            onClick={() => handleRenewal(subscription.plan)}
            disabled={renewing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {renewing ? 'Renewing...' : 'Renew Subscription'}
          </Button>
          
          {subscription.lastPayment && (
            <div className="text-xs text-gray-400 text-center">
              Last payment: ${(subscription.lastPayment.amount / 100).toFixed(2)} {subscription.lastPayment.currency}
            </div>
          )}
        </div>
      )}

      {subscription.plan === 'FREE' && (
        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Upgrade Plan
          </Button>
        </div>
      )}
    </Card>
  );
} 