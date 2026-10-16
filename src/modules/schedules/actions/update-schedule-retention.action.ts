"use server";

import { settingRepository } from "@/src/modules/settings";
import {
  UpdateScheduleRetentionInput,
  UpdateScheduleRetentionSchema,
} from "../schemas/update-schedule-retention.schema";

export async function updateScheduleRetentionAction(input: UpdateScheduleRetentionInput) {
  try {
    const validated = UpdateScheduleRetentionSchema.parse(input);
    const updated = await settingRepository.update({
      scheduleRetentionType: validated.retentionType,
      scheduleRetentionValue: validated.retentionValue,
    });
    return {
      success: true,
      message: "Aturan masa simpan (auto-cleanup) berhasil diperbarui.",
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui aturan retensi.",
    };
  }
}
