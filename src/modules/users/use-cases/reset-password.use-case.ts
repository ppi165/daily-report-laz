import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { ResetPasswordInput, ResetPasswordSchema } from '../schemas/reset-password.schema';

export class ResetPasswordUseCase {
  async execute(input: ResetPasswordInput, actorId: string) {
    const validated = ResetPasswordSchema.parse(input);

    if (!actorId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pemohon tidak ditemukan di database.');
    }

    if (actor.role !== 'SUPERADMIN' && actor.role !== 'ADMIN') {
      throw new Error('Hanya Superadmin dan Admin yang berwenang melakukan reset password.');
    }

    const targetUser = await userRepository.findById(validated.targetUserId);
    if (!targetUser) {
      throw new Error('Pengguna target tidak ditemukan.');
    }

    // Hierarki Hak Akses Reset Password:
    // 1. SUPERADMIN: break-glass account, dapat mereset siapa saja (ADMIN, SUPERVISOR, STAFF, maupun SUPERADMIN).
    // 2. ADMIN: hanya dapat mereset akun SUPERVISOR dan STAFF.
    if (actor.role === 'ADMIN') {
      if (targetUser.role === 'SUPERADMIN') {
        throw new Error('Pelanggaran hak akses: Admin tidak memiliki izin untuk mereset akun Superadmin.');
      }
      if (targetUser.role === 'ADMIN' && targetUser.id !== actor.id) {
        throw new Error('Pelanggaran hak akses: Admin tidak memiliki izin untuk mereset akun sesama Admin.');
      }
    }

    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);
    await userRepository.updatePassword(targetUser.id, hashedPassword);

    return {
      success: true,
      message: `Password untuk ${targetUser.name} (${targetUser.role}) berhasil diperbarui.`,
      targetUser: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        role: targetUser.role,
      },
    };
  }
}

export const resetPasswordUseCase = new ResetPasswordUseCase();
