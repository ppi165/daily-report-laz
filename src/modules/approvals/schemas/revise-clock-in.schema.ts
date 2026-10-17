import { z } from "zod";

export const ReviseClockInSchema = z.object({
  reportId: z.string().min(1, "ID Laporan wajib diisi"),
  content: z.string().trim().min(5, "Rincian revisi pekerjaan minimal 5 karakter"),
  attachments: z.array(z.string()).optional(),
});

export type ReviseClockInInput = z.infer<typeof ReviseClockInSchema>;
