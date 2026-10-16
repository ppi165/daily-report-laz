"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { getAllUsersUseCase, UserFilterOptions } from '../use-cases/get-all-users.use-case';

export async function getAllUsersAction(filters?: UserFilterOptions) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid.' };
    }

    const data = await getAllUsersUseCase.execute(filters);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memuat daftar amil.',
    };
  }
}
