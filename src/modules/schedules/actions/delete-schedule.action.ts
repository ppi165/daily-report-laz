"use server";

import { deleteScheduleUseCase } from "../use-cases/delete-schedule.use-case";

export async function deleteScheduleAction(id: string) {
  try {
    await deleteScheduleUseCase.execute(id);
    return { success: true, message: "Jadwal khusus berhasil dihapus." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus jadwal khusus.",
    };
  }
}
