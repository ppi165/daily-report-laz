"use server";

import { getClockInReportsUseCase } from '../use-cases/get-clock-in-reports.use-case';

export async function getClockInReportsAction() {
  try {
    const data = await getClockInReportsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil data clock-in.',
      data: [],
    };
  }
}
