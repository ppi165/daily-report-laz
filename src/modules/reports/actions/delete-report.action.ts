"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { verifyJWT } from '@/src/infrastructure/auth';
import { deleteReportUseCase } from '../use-cases/delete-report.use-case';
import { DeleteReportSchema, DeleteReportInput } from '../schemas/delete-report.schema';

export async function deleteReportAction(input: DeleteReportInput) {
  try {
    const validated = DeleteReportSchema.parse(input);
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan. Silakan login kembali.' };
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return { success: false, message: 'Unauthorized: Token tidak valid.' };
    }

    const result = await deleteReportUseCase.execute(validated.reportId, payload.userId as string);

    // Revalidate paths agar data laporan yang dihapus terhapus di seluruh halaman
    revalidatePath('/rekap-report');
    revalidatePath('/feed');
    revalidatePath('/dashboard');
    revalidatePath('/verifikasi');
    revalidatePath('/');

    return {
      success: true,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat menghapus laporan.',
    };
  }
}
