import { z } from 'zod';

export const UpdateUserRoleSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID wajib ada'),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'STAFF'], {
    message: 'Pilihan role hanya boleh SUPERADMIN, ADMIN, SUPERVISOR, atau STAFF',
  }),
  position: z.string().min(1, 'Jabatan / Posisi wajib diisi'),
  reason: z.string().optional(),
});

export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
