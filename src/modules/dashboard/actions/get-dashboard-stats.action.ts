"use server";

import { getDashboardStatsUseCase } from '../use-cases/get-dashboard-stats.use-case';

export async function getDashboardStatsAction() {
  try {
    const data = await getDashboardStatsUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengambil statistik dashboard',
    };
  }
}
