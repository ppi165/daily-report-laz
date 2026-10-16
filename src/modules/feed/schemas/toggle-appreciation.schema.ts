import { z } from "zod";

export const ToggleAppreciationSchema = z.object({
  reportId: z.string().min(1, "ID Laporan wajib diisi"),
});

export type ToggleAppreciationInput = z.infer<typeof ToggleAppreciationSchema>;
