import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasCheckedAuth: false, // Track if we've already checked auth

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setSession: (session) => set({ session }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {

          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })


          const data = await response.json()


          if (!response.ok) {
            throw new Error(data.message || 'Login failed')
          }

          set({ 
            user: data.user, 
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
            error: null 
          })

          return { success: true, user: data.user }
        } catch (error) {
          console.error('Login error:', error)
          set({ 
            isLoading: false, 
            error: error.message,
            isAuthenticated: false 
          })
          return { success: false, error: error.message }
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Signup failed')
          }

          set({ 
            user: data.user, 
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
            error: null 
          })

          return { success: true, user: data.user }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message,
            isAuthenticated: false 
          })
          return { success: false, error: error.message }
        }
      },

      logout: async () => {
        set({ isLoading: true })
        
        try {
          // Call logout API to invalidate session
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (error) {
          console.error('Logout API error:', error)
        }

        // Clear local state regardless of API response
        set({ 
          user: null, 
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          hasCheckedAuth: false
        })
      },

      checkAuth: async () => {
        const state = get()
        
        // Don't check auth if we've already checked and there's no session
        if (state.hasCheckedAuth && !state.session) {
          return
        }
        
        // Check if there's a session cookie before making the API call
        if (typeof document !== 'undefined') {
          const hasSessionCookie = document.cookie.includes('session_token=')
          if (!hasSessionCookie) {
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false,
              hasCheckedAuth: true
            })
            return
          }
        }
        
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include',
          })

          if (response.ok) {
            const data = await response.json()
            set({ 
              user: data.user, 
              isAuthenticated: true,
              isLoading: false,
              hasCheckedAuth: true
            })
          } else {
            // Don't log errors for expected 401 responses
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false,
              hasCheckedAuth: true
            })
          }
        } catch (error) {
          // Only log unexpected errors, not network issues
          if (error.name !== 'TypeError') {
            console.error('Auth check error:', error)
          }
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            hasCheckedAuth: true
          })
        }
      },

      clearError: () => set({ error: null }),

      // SDK integration helpers
      getToken: async () => {
        const state = get();
        return state.session?.token || '';
      },
      setToken: async (newToken) => {
        const state = get();
        set({ session: { ...state.session, token: newToken } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        hasCheckedAuth: state.hasCheckedAuth
      }),
    }
  )
)

export default useAuthStore 