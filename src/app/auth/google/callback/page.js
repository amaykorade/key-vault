'use client'

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../../../stores/authStore';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresSignup, setRequiresSignup] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }
        
        // Send code to our backend
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();

        if (response.status === 404 && data.requiresSignup) {
          // User doesn't exist, show signup required message
          setRequiresSignup(true);
          setUserInfo({
            email: data.email,
            name: data.name
          });
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }
        
        // Set user in store
        setUser(data.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
        
      } catch (error) {
        console.error('Google callback error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, setUser]);

  const handleGoogleSignup = async () => {
    if (!userInfo) return;
    
    setSignupLoading(true);
    try {
      const response = await fetch('/api/auth/google-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Set user in store
      setUser(data.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Google signup error:', error);
      setError(error.message);
      setSignupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Completing Google sign-in...</p>
        </div>
      </div>
    );
  }

  if (requiresSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="bg-yellow-900 border border-yellow-700 rounded-md p-6 max-w-md">
            <div className="mb-4">
              <svg className="h-12 w-12 text-yellow-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-yellow-300 mb-2">
              Account Not Found
            </h3>
            <p className="text-yellow-200 mb-4">
              We found your Google account ({userInfo?.email}), but you don't have a Key Vault account yet. Please sign up first.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignup}
                disabled={signupLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signupLoading ? 'Creating Account...' : 'Create Account with Google'}
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Sign Up with Email
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="bg-red-900 border border-red-700 rounded-md p-4 max-w-md">
            <h3 className="text-lg font-medium text-red-300 mb-2">
              Authentication Error
            </h3>
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
} 