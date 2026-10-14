import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email atau Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
  remember: z.boolean().optional().default(false),
});

export type LoginInput = z.input<typeof LoginSchema>;
