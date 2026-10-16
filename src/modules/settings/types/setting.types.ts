export interface SystemSettingData {
  id: string;
  dailyDeadlineTime: string;
  reminderTime: string;
  clockInMaxDays: number;
  clockInRequiredWitness: number;
  clockInRequireReason: boolean;
  workDays: string[];
  isRamadhanMode: boolean;
  ramadhanDeadlineTime: string;
  requirePhoto: boolean;
  feedVisibility: string;
  scheduleRetentionType: string;
  scheduleRetentionValue: number;
  updatedAt: Date | string;
}
