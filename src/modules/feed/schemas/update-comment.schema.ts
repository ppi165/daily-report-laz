import { z } from "zod";

export const UpdateCommentSchema = z.object({
  commentId: z.string().min(1, "ID Komentar wajib diisi"),
  content: z.string().trim().min(1, "Komentar tidak boleh kosong").max(1000, "Komentar maksimal 1000 karakter"),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;
