"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { deleteAvatarUseCase } from '../use-cases/delete-avatar.use-case';

export async function deleteAvatarAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Token tidak valid.' };
    }

    const result = await deleteAvatarUseCase.execute(payload.userId as string);
    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus foto profil.',
    };
  }
}
