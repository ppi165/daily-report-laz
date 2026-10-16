import { z } from 'zod';

export const CreateDivisionSchema = z.object({
  name: z.string().min(2, 'Nama bidang minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  description: z.string().optional().default(''),
  leaderName: z.string().optional().default(''),
});

export type CreateDivisionInput = z.input<typeof CreateDivisionSchema>;
