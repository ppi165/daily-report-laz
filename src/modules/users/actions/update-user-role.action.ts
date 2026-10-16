"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { UpdateUserRoleInput, UpdateUserRoleSchema } from '../schemas/update-user-role.schema';
import { updateUserRoleUseCase } from '../use-cases/update-user-role.use-case';

export async function updateUserRoleAction(rawInput: UpdateUserRoleInput) {
  try {
    const validated = UpdateUserRoleSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid.' };
    }

    const result = await updateUserRoleUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengubah tingkatan hak akses.',
    };
  }
}
