"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { UpdateUserInput, UpdateUserSchema } from '../schemas/update-user.schema';
import { updateUserUseCase } from '../use-cases/update-user.use-case';

export async function updateUserAction(rawInput: UpdateUserInput) {
  try {
    const validated = UpdateUserSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid.' };
    }

    const result = await updateUserUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memperbarui data amil.',
    };
  }
}
