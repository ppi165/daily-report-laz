import { scheduleRepository } from "../repositories/schedule.repository";
import { settingRepository } from "@/src/modules/settings";

export class CleanupExpiredSchedulesUseCase {
  async execute() {
    const settings = await settingRepository.findDefault();

    if (settings.scheduleRetentionType === "NEVER") {
      return { deletedCount: 0 };
    }

    const now = new Date();
    const threshold = new Date(now);

    if (settings.scheduleRetentionType === "YEAR") {
      threshold.setFullYear(threshold.getFullYear() - settings.scheduleRetentionValue);
    } else {
      // Default: MONTH
      threshold.setMonth(threshold.getMonth() - settings.scheduleRetentionValue);
    }

    const result = await scheduleRepository.deleteExpiredBefore(threshold);
    return { deletedCount: result.count };
  }
}

export const cleanupExpiredSchedulesUseCase = new CleanupExpiredSchedulesUseCase();
