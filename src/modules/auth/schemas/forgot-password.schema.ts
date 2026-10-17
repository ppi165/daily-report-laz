import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
