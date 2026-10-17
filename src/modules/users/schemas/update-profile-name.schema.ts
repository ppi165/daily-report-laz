import { z } from 'zod';

export const UpdateProfileNameSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
});

export type UpdateProfileNameInput = z.infer<typeof UpdateProfileNameSchema>;
