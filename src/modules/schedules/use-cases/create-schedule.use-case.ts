import { scheduleRepository } from "../repositories/schedule.repository";
import { CreateScheduleInput, CreateScheduleSchema } from "../schemas/create-schedule.schema";

export class CreateScheduleUseCase {
  async execute(input: CreateScheduleInput) {
    const validated = CreateScheduleSchema.parse(input);
    return scheduleRepository.create(validated);
  }
}

export const createScheduleUseCase = new CreateScheduleUseCase();
