'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

export default function AuthProvider({ children }) {
  const { checkAuth, setLoading } = useAuthStore()

  useEffect(() => {
    // Ensure loading is set to false immediately to prevent UI blocking
    setLoading(false)
    
    // Check authentication status in the background
    const initAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('AuthProvider: Error during auth check:', error)
        // Ensure loading is set to false even if checkAuth fails
        setLoading(false)
      }
    }

    // Add a timeout as a fallback to ensure loading doesn't get stuck
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 3000) // 3 second timeout

    initAuth()

    return () => clearTimeout(timeoutId)
  }, [checkAuth, setLoading])

  // Render children immediately without any loading state
  return children
} 