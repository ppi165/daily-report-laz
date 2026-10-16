import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID wajib ada'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
