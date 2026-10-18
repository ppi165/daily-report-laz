import { z } from "zod";

export const ToggleAppreciationSchema = z.object({
  reportId: z.string().min(1, "ID Laporan wajib diisi"),
  targetLiked: z.boolean().optional(),
});

export type ToggleAppreciationInput = z.infer<typeof ToggleAppreciationSchema>;
