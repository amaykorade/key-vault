import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false, // Start with loading false to prevent UI blocking
      error: null,
      hasCheckedAuth: false, // Track if we've already checked auth
      isInitialized: false, // Track if auth has been initialized

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null,
        isInitialized: true
      }),

      setSession: (session) => set({ session }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Initialize auth state from session
      initializeAuth: async () => {
        const state = get()
        
        // Don't re-initialize if already done
        if (state.isInitialized) {
          return
        }

        set({ isLoading: true })

        try {
          // Check if there's a session cookie
          const hasSessionCookie = typeof document !== 'undefined' && 
            document.cookie.includes('session_token=')

          if (hasSessionCookie) {
            const response = await fetch('/api/auth/me', {
              credentials: 'include',
            })

            if (response.ok) {
              const data = await response.json()
              set({ 
                user: data.user, 
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isInitialized: true
              })
            } else {
              // Clear auth state if session is invalid
              set({ 
                user: null, 
                isAuthenticated: false,
                isLoading: false,
                error: null,
                isInitialized: true
              })
            }
          } else {
            // No session cookie, clear auth state
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false,
              error: null,
              isInitialized: true
            })
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isInitialized: true
          })
        }
      },

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
            error: null,
            isInitialized: true
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
            error: null,
            isInitialized: true
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
          hasCheckedAuth: false,
          isInitialized: true
        })
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
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized
      }), // only persist these fields
    }
  )
)

export default useAuthStore 