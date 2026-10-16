import { z } from "zod";

export const UpdateScheduleRetentionSchema = z.object({
  retentionType: z.enum(["MONTH", "YEAR", "NEVER"]),
  retentionValue: z.number().int().min(1).max(12),
});

export type UpdateScheduleRetentionInput = z.infer<typeof UpdateScheduleRetentionSchema>;
