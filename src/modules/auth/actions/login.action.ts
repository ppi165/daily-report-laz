"use server";

import { cookies } from 'next/headers';
import { LoginSchema, LoginInput } from '../schemas/login.schema';
import { loginUseCase } from '../use-cases/login.use-case';

export async function loginAction(rawInput: LoginInput) {
  try {
    const validated = LoginSchema.parse(rawInput);
    const result = await loginUseCase.execute(validated);

    const cookieStore = await cookies();

    // Session cookie: tidak diset maxAge/expires agar sesi otomatis terhapus saat browser/tab ditutup
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Login berhasil',
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan pada sistem autentikasi',
    };
  }
}
