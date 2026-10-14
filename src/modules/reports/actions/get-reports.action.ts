"use server";

import { GetReportsInput } from '../schemas/get-reports.schema';
import { getReportsUseCase } from '../use-cases/get-reports.use-case';

export async function getReportsAction(input?: GetReportsInput) {
  try {
    const reports = await getReportsUseCase.execute(input);
    return { success: true, data: reports };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data laporan',
    };
  }
}
