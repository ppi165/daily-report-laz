"use server";

import { updateScheduleUseCase } from "../use-cases/update-schedule.use-case";
import { UpdateScheduleInput } from "../schemas/update-schedule.schema";

export async function updateScheduleAction(input: UpdateScheduleInput) {
  try {
    const data = await updateScheduleUseCase.execute(input);
    return { success: true, message: "Jadwal khusus berhasil diperbarui.", data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui jadwal khusus.",
    };
  }
}
