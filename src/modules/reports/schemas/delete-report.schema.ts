import { z } from 'zod';

export const DeleteReportSchema = z.object({
  reportId: z.string().min(1, 'ID Laporan wajib diisi'),
});

export type DeleteReportInput = z.infer<typeof DeleteReportSchema>;
