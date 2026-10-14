"use server";

import { cookies } from 'next/headers';
import { verifyJWT } from '@/src/infrastructure/auth';
import { CreateReportInput, CreateReportSchema } from '../schemas/create-report.schema';
import { createReportUseCase } from '../use-cases/create-report.use-case';

export async function createReportAction(rawInput: CreateReportInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { success: false, message: 'Unauthorized: Sesi tidak ditemukan' };
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return { success: false, message: 'Unauthorized: Sesi tidak valid' };
    }

    const validated = CreateReportSchema.parse(rawInput);
    const report = await createReportUseCase.execute(validated, decoded.userId as string);

    return {
      success: true,
      message: 'Laporan berhasil disimpan',
      data: report,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menyimpan laporan',
    };
  }
}
