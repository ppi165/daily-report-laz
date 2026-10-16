import { z } from 'zod';

export const CreateReportSchema = z.object({
  title: z.string().optional().default(''),
  content: z.string().min(1, 'Konten aktivitas laporan wajib diisi'),
  division: z.string().min(1, 'Divisi pelaporan wajib diisi'),
  attachments: z.array(z.string()).optional().default([]),
  reportDate: z.string().optional(),
  isClockIn: z.boolean().optional().default(false),
  approverMockIds: z.array(z.string()).optional().default([]),
});

export type CreateReportInput = z.input<typeof CreateReportSchema>;
