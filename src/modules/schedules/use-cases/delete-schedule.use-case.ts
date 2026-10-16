import { scheduleRepository } from "../repositories/schedule.repository";

export class DeleteScheduleUseCase {
  async execute(id: string) {
    if (!id) {
      throw new Error("ID jadwal wajib diisi.");
    }
    return scheduleRepository.delete(id);
  }
}

export const deleteScheduleUseCase = new DeleteScheduleUseCase();
