import { scheduleRepository } from "../repositories/schedule.repository";

export class GetActiveScheduleUseCase {
  async execute(date: Date = new Date()) {
    return scheduleRepository.findActiveForDate(date);
  }
}

export const getActiveScheduleUseCase = new GetActiveScheduleUseCase();
