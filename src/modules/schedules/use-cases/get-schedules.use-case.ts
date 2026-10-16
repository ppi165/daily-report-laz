import { scheduleRepository } from "../repositories/schedule.repository";
import { cleanupExpiredSchedulesUseCase } from "./cleanup-expired-schedules.use-case";
import { ScheduleStatus } from "../types/schedule.types";

export class GetSchedulesUseCase {
  async execute() {
    // Jalankan auto-cleanup terlebih dahulu
    try {
      await cleanupExpiredSchedulesUseCase.execute();
    } catch {
      // Abaikan jika ada kegagalan background cleanup agar tidak memutus query utama
    }

    const schedules = await scheduleRepository.findAll();
    const now = new Date();

    return schedules.map((item) => {
      let status: ScheduleStatus = "ACTIVE";

      if (now < item.startDate) {
        status = "UPCOMING";
      } else if (now > item.endDate || !item.isActive) {
        status = "EXPIRED";
      }

      return {
        ...item,
        status,
      };
    });
  }
}

export const getSchedulesUseCase = new GetSchedulesUseCase();
