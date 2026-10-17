import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './src/infrastructure/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const verifiedToken = token ? await verifyJWT(token) : null;

  // 1. Rute yang memerlukan autentikasi login (Protected Routes)
  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/daily-report') ||
    path.startsWith('/rekap-report') ||
    path.startsWith('/reports') ||
    path.startsWith('/verifikasi') ||
    path.startsWith('/feed') ||
    path.startsWith('/settings') ||
    path.startsWith('/admin') ||
    path.startsWith('/profil');

  if (isProtectedRoute) {
    if (!token || !verifiedToken) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      if (token && !verifiedToken) {
        response.cookies.delete('token');
      }
      return response;
    }
  }

  // 2. Jika amil sudah terautentikasi dan mengakses halaman login, alihkan langsung ke dashboard
  if (path === '/login' && verifiedToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/daily-report/:path*',
    '/rekap-report/:path*',
    '/reports/:path*',
    '/verifikasi/:path*',
    '/feed/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/profil/:path*',
    '/login',
  ],
};
