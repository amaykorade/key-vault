'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Lock } from 'lucide-react';

/**
 * PlanBasedFeature - Shows a feature with plan-based access control
 */
export default function PlanBasedFeature({ 
  feature, 
  children, 
  className = "",
  showUpgradePrompt = true,
  upgradeMessage = "Upgrade required"
}) {
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/features')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserFeatures(data.features);
        }
      })
      .catch(err => console.error('Failed to fetch user features:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={className}>{children}</div>;
  }

  const isAvailable = userFeatures?.[feature];
  
  if (isAvailable) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${className} relative group`}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      
      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-600 max-w-xs">
          <div className="flex items-center mb-2">
            <Lock className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-white">Premium Feature</span>
          </div>
          <p className="text-xs text-gray-300 mb-3">
            {upgradeMessage}
          </p>
          {showUpgradePrompt && (
            <Link 
              href="/pricing" 
              className="inline-flex items-center text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * PlanBasedLink - Shows a link with plan-based access control
 */
export function PlanBasedLink({ 
  feature, 
  href, 
  children, 
  className = "",
  fallbackHref = "/pricing"
}) {
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/features')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserFeatures(data.features);
        }
      })
      .catch(err => console.error('Failed to fetch user features:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const isAvailable = userFeatures?.[feature];
  
  return (
    <Link 
      href={isAvailable ? href : fallbackHref} 
      className={`${className} ${!isAvailable ? 'text-gray-500 cursor-not-allowed' : ''}`}
    >
      {children}
      {!isAvailable && (
        <Crown className="h-3 w-3 ml-1 text-yellow-500 inline" title="Upgrade required" />
      )}
    </Link>
  );
}

/**
 * PlanBadge - Shows current plan with upgrade option
 */
export function PlanBadge({ className = "" }) {
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/features')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserFeatures(data.features);
        }
      })
      .catch(err => console.error('Failed to fetch user features:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !userFeatures) {
    return null;
  }

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'FREE': return 'bg-gray-600 text-gray-200';
      case 'PRO': return 'bg-blue-600 text-white';
      case 'TEAM': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xs text-gray-400 mr-2">Plan:</span>
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(userFeatures.plan)}`}>
        {userFeatures.plan === 'TEAM' && <Crown className="h-3 w-3 mr-1" />}
        {userFeatures.planName}
      </span>
      {userFeatures.plan === 'FREE' && (
        <Link 
          href="/pricing" 
          className="text-xs text-blue-400 hover:text-blue-300 ml-2"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
} 