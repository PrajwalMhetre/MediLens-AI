import { NextResponse, type NextRequest } from 'next/server';

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
  const token = request.cookies.get('medilens_session')?.value;

  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
