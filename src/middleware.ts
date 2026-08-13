import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

const protectedPaths = [
  '/dashboard',
  '/analysis',
  '/reports',
  '/history',
  '/assistant',
  '/drug-scanner',
  '/profile',
  '/settings',
  '/admin',
];

const authPaths = ['/login', '/register', '/verify-email', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const payload = verifyToken(token) as { role?: string };

      if (isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (isAdminPath && payload.role !== 'Administrator') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      if (isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  if (isProtectedPath) {
    try {
      verifyToken(token ?? '');
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/dashboard/:path*',
    '/analysis/:path*',
    '/reports/:path*',
    '/history/:path*',
    '/assistant/:path*',
    '/drug-scanner/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
