"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { getClockInReportsUseCase } from '../use-cases/get-clock-in-reports.use-case';

export async function getClockInReportsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = token ? await verifyJWT(token) : null;

    const data = await getClockInReportsUseCase.execute(
      decoded?.userId as string | undefined,
      decoded?.role as string | undefined
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data clock-in.',
      data: [],
    };
  }
}
