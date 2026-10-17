import { z } from 'zod';

export const UpdateUserSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID wajib ada'),
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-z0-9_.-]+$/, 'Username hanya boleh huruf kecil, angka, garis bawah, titik, dan strip'),
  email: z.string().email('Alamat email tidak valid'),
  division: z.string().min(1, 'Divisi penugasan wajib dipilih'),
  position: z.string().min(1, 'Jabatan / Posisi wajib diisi'),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'STAFF'], {
    message: 'Pilihan role hanya boleh SUPERADMIN, ADMIN, SUPERVISOR, atau STAFF',
  }),
  reason: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
