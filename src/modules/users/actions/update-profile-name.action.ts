"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { UpdateProfileNameInput, UpdateProfileNameSchema } from '../schemas/update-profile-name.schema';
import { updateProfileNameUseCase } from '../use-cases/update-profile-name.use-case';

export async function updateProfileNameAction(rawInput: UpdateProfileNameInput) {
  try {
    const validated = UpdateProfileNameSchema.parse(rawInput);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Token tidak valid.' };
    }

    const result = await updateProfileNameUseCase.execute(validated, payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui nama profil',
    };
  }
}
