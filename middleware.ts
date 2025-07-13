import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/confirm', '/error'];
    
    // Auth routes
    const authRoutes = ['/auth/login', '/auth/signup'];
    
    // Protected routes that require authentication and onboarding
    const protectedRoutes = ['/dashboard'];
    
    // Onboarding route
    const onboardingRoute = '/onboarding';

    // If user is authenticated
    if (token) {
      // If user is on auth pages and already logged in, redirect based on onboarding status
      if (authRoutes.includes(pathname)) {
        if (token.is_onboarded) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        } else {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }

      // If user is not onboarded
      if (!token.is_onboarded) {
        // Allow onboarding page - DON'T redirect if already on onboarding
        if (pathname === onboardingRoute) {
          return NextResponse.next();
        }
        // Allow public routes
        if (publicRoutes.includes(pathname)) {
          return NextResponse.next();
        }
        // Redirect everything else to onboarding
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      // If user is onboarded but trying to access onboarding page
      if (token.is_onboarded && pathname === onboardingRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } else {
      // User is not authenticated
      // Redirect protected routes to login
      if (protectedRoutes.some(route => pathname.startsWith(route)) || pathname === onboardingRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 