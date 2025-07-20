'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '../stores/authStore';
import Button from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
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
    await logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section: Logo and nav links */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img src="/file.svg" className="h-7 w-7" alt="Key Vault Logo" />
              <span className="text-xl font-bold text-white">Key Vault</span>
            </Link>
            <div className="hidden sm:flex sm:space-x-6 ml-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/docs" className="text-gray-300 hover:text-white text-sm font-medium">
                Documentation
              </Link>
              <Link href="/api" className="text-gray-300 hover:text-white text-sm font-medium">
                API
              </Link>
            </div>
          </div>

          {/* Right section: User dropdown or auth buttons */}
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="ml-3 relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
                >
                  <User className="h-6 w-4 text-gray-300" />
                  <ChevronDown className="h-4 w-4 text-gray-300" />
                </button>
                {profileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
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
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 