'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuthStore from '../stores/authStore';
import Button from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Key, Crown, Lock } from 'lucide-react';
import { PlanBasedLink, PlanBadge } from './PlanBasedFeature.js';

export default function Navbar() {
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userFeatures, setUserFeatures] = useState(null);
  const dropdownRef = useRef(null);

  // Determine if user is authenticated - only show authenticated state after initialization
  const isUserAuthenticated = isInitialized && isAuthenticated && user;

  // Fetch user features for plan-based UI
  useEffect(() => {
    if (isUserAuthenticated) {
      fetch('/api/user/features')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserFeatures(data.features);
          }
        })
        .catch(err => console.error('Failed to fetch user features:', err));
    }
  }, [isUserAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/auth/login');
    }
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section: Logo and nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
                              <img src="/logo-large.svg" alt="API Vault" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">API Vault</span>
            </Link>
            <div className="hidden sm:flex sm:space-x-6 ml-6">
              {isUserAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium">
                    Dashboard
                  </Link>
                  
                  {/* Plans & Teams - Premium Feature */}
                  <PlanBasedLink 
                    feature="teamFeatures" 
                    href="/teams" 
                    className="text-gray-300 hover:text-white text-sm font-medium flex items-center"
                  >
                    Plans & Teams
                  </PlanBasedLink>
                  
                  <Link href="/api" className="text-gray-300 hover:text-white text-sm font-medium">
                    API
                  </Link>
                  
                  {/* Access Control - Premium Feature */}
                  {userFeatures?.rbac ? (
                    <div className="relative group">
                      <button className="text-gray-300 hover:text-white text-sm font-medium flex items-center">
                        Access Control
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <Link
                          href="/admin/access"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                        >
                          Access Overview
                        </Link>
                        <Link
                          href="/admin/roles"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                        >
                          Role Management
                        </Link>
                        <Link
                          href="/admin/teams"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                        >
                          Team Management
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <button className="text-gray-500 cursor-not-allowed text-sm font-medium flex items-center">
                        Access Control
                        <ChevronDown className="h-4 w-4 ml-1" />
                        <Lock className="h-3 w-3 ml-1 text-yellow-500" title="Upgrade to Team plan" />
                      </button>
                      <div className="absolute left-0 mt-2 w-64 bg-slate-800 rounded-md shadow-lg py-2 z-50 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="px-3 py-2">
                          <p className="text-xs text-gray-400">RBAC requires Team plan</p>
                          <Link href="/pricing" className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block">
                            Upgrade now →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
              <Link href="/docs" className="text-gray-300 hover:text-white text-sm font-medium">
                Documentation
              </Link>
            </div>
          </div>

          {/* Right section: User dropdown or auth buttons */}
          <div className="flex items-center">
            {isUserAuthenticated ? (
              <div className="ml-3 relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
                >
                  <User className="h-6 w-4 text-gray-300" />
                  <ChevronDown className="h-4 w-4 text-gray-300" />
                </button>
                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-slate-900 ring-1 ring-black ring-opacity-5 z-50 border border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <PlanBadge className="mt-1" />
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account
                    </Link>
                    
                    <Link
                      href="/subscription"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Subscription
                    </Link>
                    
                    {/* PRO Features */}
                    {userFeatures?.apiAnalytics && (
                      <>
                        <Link
                          href="/audit-logs"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Audit Logs
                        </Link>
                        <Link
                          href="/analytics"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Analytics
                        </Link>
                      </>
                    )}
                    <div className="border-t border-slate-700 my-1"></div>
                    {userFeatures?.rbac ? (
                      <>
                        <Link
                          href="/admin/access"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Access Control
                        </Link>
                        <Link
                          href="/admin/roles"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Role Management
                        </Link>
                      </>
                    ) : (
                      <div className="px-4 py-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Lock className="h-4 w-4 mr-2" />
                          Access Control
                          <Crown className="h-3 w-3 ml-1 text-yellow-500" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Upgrade to Team plan for RBAC</p>
                        <Link 
                          href="/pricing" 
                          className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                          onClick={() => setProfileOpen(false)}
                        >
                          Upgrade now →
                        </Link>
                      </div>
                    )}
                    <div className="border-t border-slate-700 my-1"></div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">Get Started for Free</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 