"use server";

import { cookies } from 'next/headers';
import { getCurrentUserUseCase } from '../use-cases/get-current-user.use-case';

export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const user = await getCurrentUserUseCase.execute(token);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data pengguna',
    };
  }
}
