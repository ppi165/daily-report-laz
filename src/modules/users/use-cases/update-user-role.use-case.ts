import { userRepository } from '../repositories/user.repository';
import { UpdateUserRoleInput, UpdateUserRoleSchema } from '../schemas/update-user-role.schema';

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

    // Aturan Hierarki Proteksi Role:
    // 1. Akun Superadmin adalah pemegang otoritas tertinggi mutlak dan tidak dapat diturunkan posisinya
    if (targetUser.role === 'SUPERADMIN') {
      throw new Error('Pelanggaran hak akses: Akun Superadmin adalah pemegang otoritas tertinggi sistem dan tidak dapat diturunkan rolenya.');
    }

    if (actor.role === 'ADMIN') {
      // Admin dilarang mendemosikan/mengubah role sesama Admin
      if (targetUser.role === 'ADMIN' && targetUser.id !== actor.id && validated.role !== 'ADMIN') {
        throw new Error('Pelanggaran hak akses: Hanya Superadmin yang berwenang mencabut status Admin pimpinan lain.');
      }
    }

    const updatedUser = await userRepository.updateUserRoleAndPosition(
      targetUser.id,
      validated.role,
      validated.position.trim()
    );

    return {
      success: true,
      message: `Hak akses untuk '${updatedUser.name}' berhasil diperbarui menjadi ${updatedUser.role} (${updatedUser.position}).`,
      data: updatedUser,
    };
  }
}

export const updateUserRoleUseCase = new UpdateUserRoleUseCase();
