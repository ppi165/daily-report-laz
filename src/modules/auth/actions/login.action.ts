"use server";

import { cookies } from 'next/headers';
import { LoginSchema, LoginInput } from '../schemas/login.schema';
import { loginUseCase } from '../use-cases/login.use-case';

export async function loginAction(rawInput: LoginInput) {
  try {
    const validated = LoginSchema.parse(rawInput);
    const result = await loginUseCase.execute(validated);

    const cookieStore = await cookies();

    // Cookie diset dengan maxAge 1 hari (24 jam) agar sesi browser memiliki grace period 30 menit saat ditutup
    const ONE_DAY_SECONDS = 60 * 60 * 24;
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_DAY_SECONDS,
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
