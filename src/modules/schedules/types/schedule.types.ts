export interface SpecialScheduleData {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  deadlineTime: string;
  reminderTime?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type ScheduleStatus = "ACTIVE" | "UPCOMING" | "EXPIRED";
