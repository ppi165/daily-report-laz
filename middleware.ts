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
      response.cookies.set('token', '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    // Proteksi anti-bfcache agar tombol back/forward browser tidak menampilkan halaman tersimpan setelah logout/kick
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // 2. Jika mengakses halaman login, otomatis kick/hapus sesi yang ada agar tombol back/forward mewajibkan login ulang
  if (path === '/login') {
    const response = NextResponse.next();
    response.cookies.set('token', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
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
