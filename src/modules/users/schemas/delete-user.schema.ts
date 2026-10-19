import { z } from 'zod';

export const DeleteUserSchema = z.object({
  targetUserId: z
    .string()
    .min(1, 'ID pengguna sasaran tidak boleh kosong.'),
});

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
