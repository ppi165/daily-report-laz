"use server";

import { getSchedulesUseCase } from "../use-cases/get-schedules.use-case";

export async function getSchedulesAction() {
  try {
    const data = await getSchedulesUseCase.execute();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat jadwal khusus.",
      data: [],
    };
  }
}
