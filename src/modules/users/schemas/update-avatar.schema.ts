import { z } from 'zod';

export const UpdateAvatarSchema = z.object({
  avatarUrl: z.string().url('URL avatar tidak valid'),
});

export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;
