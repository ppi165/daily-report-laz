import { z } from "zod";

export const AddCommentSchema = z.object({
  reportId: z.string().min(1, "ID Laporan wajib diisi"),
  content: z.string().trim().min(1, "Komentar tidak boleh kosong").max(1000, "Komentar maksimal 1000 karakter"),
  parentId: z.string().optional().nullable(),
});

export type AddCommentInput = z.infer<typeof AddCommentSchema>;
