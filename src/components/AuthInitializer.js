'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

export default function AuthInitializer() {
  const { initializeAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    // Only initialize if not already done
    if (!isInitialized) {
      console.log('AuthInitializer - Starting auth initialization');
      initializeAuth()
    }
  }, [initializeAuth, isInitialized])

  return null // This component doesn't render anything
} 