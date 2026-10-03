import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './src/shared/utils/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard') || 
                           path.startsWith('/daily-report') || 
                           path.startsWith('/rekap-report') || 
                           path.startsWith('/profil');

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const verifiedToken = await verifyJWT(token);
    
    if (!verifiedToken) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/daily-report/:path*', '/rekap-report/:path*', '/profil/:path*'],
};
