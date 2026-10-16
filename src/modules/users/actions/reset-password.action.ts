"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { ResetPasswordInput, ResetPasswordSchema } from '../schemas/reset-password.schema';
import { resetPasswordUseCase } from '../use-cases/reset-password.use-case';

export async function resetPasswordAction(rawInput: ResetPasswordInput) {
  try {
    const validated = ResetPasswordSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Token tidak valid.' };
    }

    const result = await resetPasswordUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.targetUser };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mereset password',
    };
  }
}
