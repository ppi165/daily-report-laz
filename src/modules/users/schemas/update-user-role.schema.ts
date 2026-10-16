import { z } from 'zod';

export const UpdateUserRoleSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID wajib ada'),
  role: z.enum(['ADMIN', 'SUPERVISOR', 'STAFF'], {
    message: 'Pilihan role hanya boleh ADMIN, SUPERVISOR, atau STAFF',
  }),
  position: z.string().min(1, 'Jabatan / Posisi wajib diisi'),
});

export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
