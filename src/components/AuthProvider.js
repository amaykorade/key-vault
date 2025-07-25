'use client'

import { useEffect, useState } from 'react'
import useAuthStore from '../stores/authStore'

export default function AuthProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true)
    
    // Check authentication status
    checkAuth()
  }, [checkAuth])

  // Show loading state while hydrating to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return children
} 