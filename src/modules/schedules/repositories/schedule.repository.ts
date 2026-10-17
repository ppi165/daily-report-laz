import { prisma } from "@/src/infrastructure/prisma";
import { CreateScheduleInput } from "../schemas/create-schedule.schema";
import { UpdateScheduleInput } from "../schemas/update-schedule.schema";

export class ScheduleRepository {
  async findAll() {
    return prisma.specialSchedule.findMany({
      orderBy: { startDate: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.specialSchedule.findUnique({
      where: { id },
    });
  }

  async findActiveForDate(date: Date) {
    // Mulai dari 00:00:00 dan berakhir 23:59:59 di hari yang bersangkutan
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    return prisma.specialSchedule.findFirst({
      where: {
        isActive: true,
        startDate: { lte: dayEnd },
        endDate: { gte: dayStart },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(input: CreateScheduleInput) {
    const startDate = new Date(`${input.startDate}T00:00:00.000Z`);
    const endDate = new Date(`${input.endDate}T23:59:59.999Z`);

    return prisma.specialSchedule.create({
      data: {
        name: input.name,
        startDate,
        endDate,
        deadlineTime: input.deadlineTime,
        reminderTime: input.reminderTime || null,
        description: input.description || null,
        isActive: input.isActive ?? true,
      },
    });
  }

  async update(id: string, input: UpdateScheduleInput) {
    const startDate = new Date(`${input.startDate}T00:00:00.000Z`);
    const endDate = new Date(`${input.endDate}T23:59:59.999Z`);

    return prisma.specialSchedule.update({
      where: { id },
      data: {
        name: input.name,
        startDate,
        endDate,
        deadlineTime: input.deadlineTime,
        reminderTime: input.reminderTime || null,
        description: input.description || null,
        isActive: input.isActive ?? true,
      },
    });
  }

  async delete(id: string) {
    return prisma.specialSchedule.delete({
      where: { id },
    });
  }

  async deleteExpiredBefore(thresholdDate: Date) {
    return prisma.specialSchedule.deleteMany({
      where: {
        endDate: {
          lt: thresholdDate,
        },
      },
    });
  }
}

export const scheduleRepository = new ScheduleRepository();
