import { userRepository } from '../repositories/user.repository';
import { UpdateUserInput, UpdateUserSchema } from '../schemas/update-user.schema';

const ROLE_LEVEL: Record<string, number> = {
  SUPERADMIN: 4,
  ADMIN: 3,
  SUPERVISOR: 2,
  STAFF: 1,
};

export class UpdateUserUseCase {
  async execute(input: UpdateUserInput, actorId: string) {
    const validated = UpdateUserSchema.parse(input);

    if (!actorId) {
      throw new Error('Unauthorized: Sesi tidak ditemukan.');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pemohon tidak ditemukan.');
    }

    if (actor.role !== 'SUPERADMIN' && actor.role !== 'ADMIN') {
      throw new Error('Hanya Superadmin dan Admin yang berwenang mengubah profil dan hak akses amil.');
    }

    const targetUser = await userRepository.findById(validated.targetUserId);
    if (!targetUser) {
      throw new Error('Pengguna sasaran tidak ditemukan.');
    }

    const oldLevel = ROLE_LEVEL[targetUser.role] || 1;
    const newLevel = ROLE_LEVEL[validated.role] || 1;
    const isDemotion = newLevel < oldLevel;

    // 1. Proteksi Mutlak Superadmin: Tidak dapat diturunkan oleh siapapun
    if (targetUser.role === 'SUPERADMIN' && validated.role !== 'SUPERADMIN') {
      throw new Error('Pelanggaran hak akses: Akun Superadmin adalah pemegang otoritas tertinggi sistem dan tidak dapat diturunkan jabatannya.');
    }

    // 2. Proteksi Self-Demotion: Admin/Amil dilarang menurunkan jabatannya sendiri
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

    // 4. Validasi Alasan Penurunan Jabatan (Wajib jika demosi, minimal 3 karakter seperti "Reshuffle")
    if (isDemotion) {
      const reason = validated.reason?.trim();
      if (!reason || reason.length < 3) {
        throw new Error('Alasan penurunan jabatan wajib diisi (minimal 3 karakter, contoh: "Reshuffle", "Rotasi", dll) untuk pertanggungjawaban audit.');
      }
    }

    // Cek duplikasi username / email pada user lain
    const duplicate = await userRepository.findByUsernameOrEmailExcludeId(
      validated.username,
      validated.email,
      targetUser.id
    );

    if (duplicate) {
      if (duplicate.username.toLowerCase() === validated.username.toLowerCase()) {
        throw new Error(`Username '${validated.username}' sudah dipakai oleh amil lain.`);
      }
      if (duplicate.email.toLowerCase() === validated.email.toLowerCase()) {
        throw new Error(`Email '${validated.email}' sudah terdaftar pada akun lain.`);
      }
    }

    const finalRole = targetUser.role === 'SUPERADMIN' ? 'SUPERADMIN' : validated.role;
    const isRoleChanged = targetUser.role !== finalRole;

    const updated = await userRepository.updateUser(targetUser.id, {
      name: validated.name.trim(),
      username: validated.username.toLowerCase().trim(),
      email: validated.email.toLowerCase().trim(),
      division: validated.division,
      position: validated.position.trim(),
      role: finalRole,
    });

    // Simpan catatan audit log jika terjadi perubahan role / demosi
    if (isRoleChanged) {
      await userRepository.createRoleAuditLog({
        targetId: targetUser.id,
        oldRole: targetUser.role,
        newRole: finalRole,
        actionType: isDemotion ? 'DEMOTION' : 'PROMOTION',
        reason: validated.reason?.trim() || (isDemotion ? 'Penurunan jabatan' : 'Penyesuaian jabatan'),
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
      });
    }

    return {
      success: true,
      message: `Data amil '${updated.name}' berhasil diperbarui.`,
      data: updated,
    };
  }
}

export const updateUserUseCase = new UpdateUserUseCase();
