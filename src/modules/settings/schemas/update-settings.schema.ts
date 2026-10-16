import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const UpdateSettingsSchema = z.object({
  dailyDeadlineTime: z.string().regex(timeRegex, 'Format jam harus HH:mm (cth: 17:00)').optional(),
  reminderTime: z.string().regex(timeRegex, 'Format jam harus HH:mm (cth: 16:00)').optional(),
  clockInMaxDays: z.number().int().min(1, 'Minimal H-1').max(14, 'Maksimal H-14').optional(),
  clockInRequiredWitness: z.number().int().min(1, 'Minimal 1 saksi').max(2, 'Maksimal 2 saksi').optional(),
  clockInRequireReason: z.boolean().optional(),
  workDays: z.array(z.string()).min(1, 'Pilih minimal 1 hari kerja').optional(),
  isRamadhanMode: z.boolean().optional(),
  ramadhanDeadlineTime: z.string().regex(timeRegex, 'Format jam harus HH:mm (cth: 15:30)').optional(),
  requirePhoto: z.boolean().optional(),
  feedVisibility: z.enum(['ALL', 'DIVISION']).optional(),
  scheduleRetentionType: z.enum(['MONTH', 'YEAR', 'NEVER']).optional(),
  scheduleRetentionValue: z.number().int().min(1).max(12).optional(),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
