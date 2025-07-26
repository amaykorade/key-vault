'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuthStore from '../stores/authStore';
import Button from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Key } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Determine if user is authenticated - only show authenticated state after initialization
  const isUserAuthenticated = isInitialized && isAuthenticated && user;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section: Logo and nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Key className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Key Vault</span>
            </Link>
            <div className="hidden sm:flex sm:space-x-6 ml-6">
              {isUserAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/teams" className="text-gray-300 hover:text-white text-sm font-medium">
                    Teams
                  </Link>
                  <Link href="/api" className="text-gray-300 hover:text-white text-sm font-medium">
                    API
                  </Link>
                </>
              ) : null}
              <Link href="/docs" className="text-gray-300 hover:text-white text-sm font-medium">
                Documentation
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white text-sm font-medium">
                Pricing
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
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
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