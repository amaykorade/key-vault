'use client'

import { Crown, Lock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * PlanIndicator - Shows if a feature is available based on user's plan
 */
export default function PlanIndicator({ 
  feature, 
  userFeatures, 
  children, 
  className = "",
  showUpgradePrompt = true 
}) {
  const isAvailable = userFeatures?.[feature];
  
  if (isAvailable) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded">
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-600 max-w-xs">
          <div className="flex items-center mb-2">
            <Lock className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-white">Premium Feature</span>
          </div>
          <p className="text-xs text-gray-300 mb-3">
            This feature requires a {feature === 'teamFeatures' || feature === 'rbac' ? 'Team' : 'Pro'} plan
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
 * PlanBadge - Small badge showing plan requirement
 */
export function PlanBadge({ plan, className = "" }) {
  const getPlanColor = (plan) => {
    switch (plan) {
      case 'FREE': return 'bg-gray-600 text-gray-200';
      case 'PRO': return 'bg-blue-600 text-white';
      case 'TEAM': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(plan)} ${className}`}>
      {plan === 'TEAM' && <Crown className="h-3 w-3 mr-1" />}
      {plan}
    </span>
  );
}

/**
 * FeatureStatus - Shows feature availability with icon
 */
export function FeatureStatus({ feature, userFeatures, showLabel = true }) {
  const isAvailable = userFeatures?.[feature];
  
  return (
    <div className="flex items-center">
      {isAvailable ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500 mr-2" />
      )}
      {showLabel && (
        <span className={`text-sm ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
          {isAvailable ? 'Available' : 'Not Available'}
        </span>
      )}
    </div>
  );
} 