import { z } from 'zod';

export const UpdateDivisionSchema = z.object({
  id: z.string().min(1, 'ID divisi wajib diisi'),
  name: z.string().min(2, 'Nama bidang minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  description: z.string().optional().default(''),
  leaderName: z.string().optional().default(''),
});

export type UpdateDivisionInput = z.input<typeof UpdateDivisionSchema>;
