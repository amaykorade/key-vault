import { NextResponse } from 'next/server'

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/keys', '/folders', '/settings', '/api', '/teams', '/projects']
const authRoutes = ['/auth/login', '/auth/signup', '/auth/google/callback']
const publicRoutes = ['/', '/about', '/contact', '/docs', '/pricing', '/privacy', '/terms']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('session_token')?.value

  // Check if user is authenticated by looking for session token
  const isAuthenticated = !!sessionToken

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // If user is on auth routes but already authenticated, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is on protected routes but not authenticated, redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 