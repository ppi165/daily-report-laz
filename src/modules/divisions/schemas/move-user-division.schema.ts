import { z } from 'zod';

export const MoveUserDivisionSchema = z.object({
  userId: z.string().min(1, 'ID pegawai wajib diisi'),
  newDivision: z.string().min(1, 'Divisi tujuan wajib diisi'),
  newPosition: z.string().optional(),
});

export type MoveUserDivisionInput = z.infer<typeof MoveUserDivisionSchema>;
