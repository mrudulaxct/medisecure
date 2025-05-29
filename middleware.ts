import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup'];
  
  // Auth routes
  const authRoutes = ['/auth/login', '/auth/signup'];
  
  // Protected routes that require authentication and onboarding
  const protectedRoutes = ['/dashboard'];
  
  // Onboarding route
  const onboardingRoute = '/onboarding';

  // If user is authenticated
  if (user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If user is on auth pages and already logged in, redirect based on onboarding status
    if (authRoutes.includes(pathname)) {
      if (profile?.is_onboarded) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }

    // If user is not onboarded
    if (profile && !profile.is_onboarded) {
      // Allow onboarding page
      if (pathname === onboardingRoute) {
        return response;
      }
      // Redirect everything else to onboarding
      if (!publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }

    // If user is onboarded but trying to access onboarding page
    if (profile?.is_onboarded && pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // User is not authenticated
    // Redirect protected routes to login
    if (protectedRoutes.some(route => pathname.startsWith(route)) || pathname === onboardingRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

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