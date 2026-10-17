import { z } from "zod";

export const DeleteCommentSchema = z.object({
  commentId: z.string().min(1, "ID Komentar wajib diisi"),
});

export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>;
