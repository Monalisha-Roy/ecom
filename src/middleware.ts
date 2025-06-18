// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/admin',
  '/admin/dashboard',
  '/cart',
  '/profile',
  '/checkout',
  '/orders'
];

const adminRoutes = [
  '/admin',
  '/admin/dashboard'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/auth', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Fetch user data from /api/auth/me
    const meResponse = await fetch(
      new URL('/api/auth/me', request.url).toString(),
      {
        headers: {
          Cookie: `token=${token}`,
        }
      }
    );

    if (!meResponse.ok) {
      throw new Error('Not authenticated');
    }

    const { user } = await meResponse.json();
    
    // Check admin routes
    if (adminRoutes.some(route => path.startsWith(route))) {
      if (user.role !== 'admin') {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    // Add user info to request headers
    const headers = new Headers(request.headers);
    headers.set('x-user-id', user.id);
    headers.set('x-user-role', user.role);
    headers.set('x-user-email', user.email);
    headers.set('x-user-name', user.name);

    return NextResponse.next({ headers });
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('token');
    
    return response;
  }
}

// Match specific routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/cart/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/orders/:path*',
  ],
};