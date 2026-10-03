import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { identifier, password, remember } = body;

      const result = await authService.login(identifier, password, remember);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        message: result.message,
        data: result.data?.user
      });

      // Set cookie dengan token
      const maxAge = result.data?.expiresIn === '30d' ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
      
      response.cookies.set({
        name: 'token',
        value: result.data!.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge
      });

      return response;

    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: 'Terjadi kesalahan pada server', error: error.message },
        { status: 500 }
      );
    }
  }

  async logout() {
    const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
    response.cookies.delete('token');
    return response;
  }
}
