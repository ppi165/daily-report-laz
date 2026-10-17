"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { getUserPerformanceUseCase } from '../use-cases/get-user-performance.use-case';

export async function getUserPerformanceAction() {
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

    const data = await getUserPerformanceUseCase.execute(payload.userId as string);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data kinerja amil',
    };
  }
}
