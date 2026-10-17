import { userRepository } from '../repositories/user.repository';
import { UpdateUserRoleInput, UpdateUserRoleSchema } from '../schemas/update-user-role.schema';

const ROLE_LEVEL: Record<string, number> = {
  SUPERADMIN: 4,
  ADMIN: 3,
  SUPERVISOR: 2,
  STAFF: 1,
};

export class UpdateUserRoleUseCase {
  async execute(input: UpdateUserRoleInput, actorId: string) {
    const validated = UpdateUserRoleSchema.parse(input);

    if (!actorId) {
      throw new Error('Unauthorized: Sesi tidak ditemukan.');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pemohon tidak ditemukan.');
    }

    if (actor.role !== 'SUPERADMIN' && actor.role !== 'ADMIN') {
      throw new Error('Hanya Superadmin dan Admin yang berwenang mengubah tingkatan hak akses amil.');
    }

    const targetUser = await userRepository.findById(validated.targetUserId);
    if (!targetUser) {
      throw new Error('Pengguna sasaran tidak ditemukan.');
    }

    const oldLevel = ROLE_LEVEL[targetUser.role] || 1;
    const newLevel = ROLE_LEVEL[validated.role] || 1;
    const isDemotion = newLevel < oldLevel;

    // 1. Akun Superadmin adalah pemegang otoritas tertinggi mutlak dan tidak dapat diturunkan posisinya
    if (targetUser.role === 'SUPERADMIN' && validated.role !== 'SUPERADMIN') {
      throw new Error('Pelanggaran hak akses: Akun Superadmin adalah pemegang otoritas tertinggi sistem dan tidak dapat diturunkan rolenya.');
    }

    // 2. Proteksi Self-Demotion: Admin dilarang menurunkan jabatannya sendiri
    if (actor.id === targetUser.id && isDemotion) {
      throw new Error('Pelanggaran hak akses: Anda tidak dapat menurunkan jabatan akun Anda sendiri. Perubahan ini minimal harus dilakukan oleh admin/superadmin lain.');
    }

    // 3. Proteksi Hierarki: Admin dilarang menyentuh Superadmin atau mendemosi sesama Admin
    if (actor.role === 'ADMIN') {
      if (targetUser.role === 'SUPERADMIN') {
        throw new Error('Pelanggaran hak akses: Akun Superadmin dilindungi dan tidak dapat diubah oleh Admin.');
      }
      if (targetUser.role === 'ADMIN' && isDemotion) {
        throw new Error('Pelanggaran hak akses: Hanya Superadmin yang berwenang menurunkan jabatan Admin.');
      }
    }

    // 4. Validasi Alasan Penurunan Jabatan
    if (isDemotion) {
      const reason = validated.reason?.trim();
      if (!reason || reason.length < 3) {
        throw new Error('Alasan penurunan jabatan wajib diisi (minimal 3 karakter, contoh: "Reshuffle", "Rotasi", dll) untuk pertanggungjawaban audit.');
      }
    }

    const isRoleChanged = targetUser.role !== validated.role;

    const updatedUser = await userRepository.updateUserRoleAndPosition(
      targetUser.id,
      validated.role,
      validated.position.trim()
    );

    if (isRoleChanged) {
      await userRepository.createRoleAuditLog({
        targetId: targetUser.id,
        oldRole: targetUser.role,
        newRole: validated.role,
        actionType: isDemotion ? 'DEMOTION' : 'PROMOTION',
        reason: validated.reason?.trim() || (isDemotion ? 'Penurunan jabatan' : 'Penyesuaian jabatan'),
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
      });
    }

    return {
      success: true,
      message: `Hak akses untuk '${updatedUser.name}' berhasil diperbarui menjadi ${updatedUser.role} (${updatedUser.position}).`,
      data: updatedUser,
    };
  }
}

export const updateUserRoleUseCase = new UpdateUserRoleUseCase();
