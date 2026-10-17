"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { ChangePasswordInput, ChangePasswordSchema } from '../schemas/change-password.schema';
import { changePasswordUseCase } from '../use-cases/change-password.use-case';

export async function changePasswordAction(rawInput: ChangePasswordInput) {
  try {
    const validated = ChangePasswordSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Token tidak valid.' };
    }

    const result = await changePasswordUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengganti password',
    };
  }
}
