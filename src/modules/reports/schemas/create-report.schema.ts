import { z } from 'zod';

export const CreateReportSchema = z
  .object({
    title: z.string().optional().default(''),
    content: z.string().trim().min(1, 'Konten aktivitas laporan wajib diisi'),
    division: z.string().min(1, 'Divisi pelaporan wajib diisi'),
    attachments: z
      .array(z.string().min(1, 'URL foto tidak valid'))
      .min(1, 'Dokumentasi foto pekerjaan wajib dilampirkan minimal 1 foto'),
    reportDate: z.string().optional(),
    isClockIn: z.boolean().optional().default(false),
    approverMockIds: z.array(z.string()).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.isClockIn) {
      const approvers = data.approverMockIds || [];
      const validApprovers = approvers.filter((id) => Boolean(id && id.trim()));

      if (validApprovers.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Verifikator wajib dipilih untuk laporan susulan (clock-in)',
          path: ['approverMockIds'],
        });
        return;
      }

      if (validApprovers.length !== approvers.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Verifikator tidak boleh kosong salah satu atau keduanya',
          path: ['approverMockIds'],
        });
        return;
      }

      if (new Set(validApprovers).size !== validApprovers.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Verifikator 1 dan Verifikator 2 tidak boleh orang yang sama',
          path: ['approverMockIds'],
        });
      }
    }
  });

export type CreateReportInput = z.input<typeof CreateReportSchema>;

