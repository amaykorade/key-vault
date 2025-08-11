'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock } from 'lucide-react';
import Link from 'next/link';

/**
 * PlanProtectedRoute - Protects routes based on plan features
 */
export default function PlanProtectedRoute({ 
  feature, 
  children, 
  fallbackComponent = null,
  redirectTo = '/pricing'
}) {
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAvailable = userFeatures?.[feature];
  
  if (isAvailable) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallbackComponent) {
    return fallbackComponent;
  }

  // Default upgrade prompt
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500/10 mb-6">
            <Lock className="h-8 w-8 text-yellow-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Premium Feature Required
          </h2>
          
          <p className="text-gray-300 mb-6">
            This feature is only available for Team plan users. Upgrade your plan to access advanced access control and team management features.
          </p>
          
          <div className="space-y-4">
            <Link
              href={redirectTo}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Team Plan
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * withPlanProtection - HOC to protect pages
 */
export function withPlanProtection(Component, feature, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <PlanProtectedRoute feature={feature} {...options}>
        <Component {...props} />
      </PlanProtectedRoute>
    );
  };
} 