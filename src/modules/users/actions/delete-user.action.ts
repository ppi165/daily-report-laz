"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { DeleteUserInput, DeleteUserSchema } from '../schemas/delete-user.schema';
import { deleteUserUseCase } from '../use-cases/delete-user.use-case';

export async function deleteUserAction(rawInput: DeleteUserInput) {
  try {
    const validated = DeleteUserSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid.' };
    }

    const result = await deleteUserUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menghapus akun pengguna.',
    };
  }
}
