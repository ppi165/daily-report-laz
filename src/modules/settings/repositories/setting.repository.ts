import { prisma } from '@/src/infrastructure/prisma';
import { UpdateSettingsInput } from '../schemas/update-settings.schema';

export class SettingRepository {
  async findDefault() {
    let setting = await prisma.systemSetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await prisma.systemSetting.create({
        data: {
          id: 'default',
          dailyDeadlineTime: '17:00',
          reminderTime: '16:00',
          clockInMaxDays: 3,
          clockInRequiredWitness: 2,
          clockInRequireReason: true,
          workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
          isRamadhanMode: false,
          ramadhanDeadlineTime: '15:30',
          requirePhoto: false,
          feedVisibility: 'ALL',
        },
      });
    }

    return setting;
  }

  async update(input: UpdateSettingsInput) {
    return prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: input,
      create: {
        id: 'default',
        dailyDeadlineTime: input.dailyDeadlineTime || '17:00',
        reminderTime: input.reminderTime || '16:00',
        clockInMaxDays: input.clockInMaxDays ?? 3,
        clockInRequiredWitness: input.clockInRequiredWitness ?? 2,
        clockInRequireReason: input.clockInRequireReason ?? true,
        workDays: input.workDays || ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        isRamadhanMode: input.isRamadhanMode ?? false,
        ramadhanDeadlineTime: input.ramadhanDeadlineTime || '15:30',
        requirePhoto: input.requirePhoto ?? false,
        feedVisibility: input.feedVisibility || 'ALL',
      },
    });
  }
}

export const settingRepository = new SettingRepository();
