"use server";

import { createScheduleUseCase } from "../use-cases/create-schedule.use-case";
import { CreateScheduleInput } from "../schemas/create-schedule.schema";

export async function createScheduleAction(input: CreateScheduleInput) {
  try {
    const data = await createScheduleUseCase.execute(input);
    return { success: true, message: "Jadwal khusus berhasil dibuat.", data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat jadwal khusus.",
    };
  }
}
