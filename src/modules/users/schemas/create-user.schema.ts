import { z } from 'zod';
import { DEFAULT_USER_PASSWORD } from '../constants/auth.constants';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-z0-9_.-]+$/, 'Username hanya boleh huruf kecil, angka, garis bawah, titik, dan strip'),
  email: z.string().email('Alamat email tidak valid'),
  division: z.string().min(1, 'Divisi penugasan wajib dipilih'),
  position: z.string().optional().default('Staf Pelaksana'),
  role: z.enum(['ADMIN', 'SUPERVISOR', 'STAFF'], {
    message: 'Pilihan role hanya boleh ADMIN, SUPERVISOR, atau STAFF',
  }),
  password: z.string().min(6).optional().default(DEFAULT_USER_PASSWORD),
});

export type CreateUserInput = z.input<typeof CreateUserSchema>;
export type CreateUserOutput = z.output<typeof CreateUserSchema>;
