import { scheduleRepository } from "../repositories/schedule.repository";
import { UpdateScheduleInput, UpdateScheduleSchema } from "../schemas/update-schedule.schema";

export class UpdateScheduleUseCase {
  async execute(input: UpdateScheduleInput) {
    const validated = UpdateScheduleSchema.parse(input);
    const existing = await scheduleRepository.findById(validated.id);
    if (!existing) {
      throw new Error("Jadwal khusus tidak ditemukan.");
    }

    return scheduleRepository.update(validated.id, validated);
  }
}

export const updateScheduleUseCase = new UpdateScheduleUseCase();
