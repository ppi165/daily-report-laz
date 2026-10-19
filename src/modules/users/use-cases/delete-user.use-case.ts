import { userRepository } from '../repositories/user.repository';
import { deleteUserRepository } from '../repositories/delete-user.repository';
import { DeleteUserInput, DeleteUserSchema } from '../schemas/delete-user.schema';

export class DeleteUserUseCase {
  async execute(input: DeleteUserInput, actorId: string) {
    const validated = DeleteUserSchema.parse(input);

    if (!actorId) {
      throw new Error('Unauthorized: Sesi tidak ditemukan.');
    }

    const actor = await userRepository.findById(actorId);
    if (!actor) {
      throw new Error('Akun pemohon tidak ditemukan.');
    }

    if (actor.role !== 'SUPERADMIN' && actor.role !== 'ADMIN') {
      throw new Error('Hanya Superadmin dan Admin yang berwenang menghapus akun amil.');
    }

    const targetUser = await deleteUserRepository.findUserById(validated.targetUserId);
    if (!targetUser) {
      throw new Error('Pengguna sasaran tidak ditemukan atau sudah dihapus.');
    }

    // 1. Larangan Menghapus Diri Sendiri
    if (actor.id === targetUser.id) {
      throw new Error('Pelanggaran hak akses: Anda tidak dapat menghapus akun Anda sendiri.');
    }

    // 2. Proteksi Hierarki Admin
    if (actor.role === 'ADMIN') {
      if (targetUser.role === 'SUPERADMIN') {
        throw new Error('Pelanggaran hak akses: Admin tidak memiliki otoritas untuk menghapus akun Superadmin.');
      }
      if (targetUser.role === 'ADMIN') {
        throw new Error('Pelanggaran hak akses: Admin dilarang menghapus sesama Admin. Tindakan ini hanya dapat dilakukan oleh Superadmin.');
      }
    }

    // 3. Proteksi Akun Superadmin Terakhir
    if (targetUser.role === 'SUPERADMIN') {
      const superadminCount = await deleteUserRepository.countSuperadmins();
      if (superadminCount <= 1) {
        throw new Error('Akun Superadmin ini adalah satu-satunya otoritas tertinggi yang tersisa di sistem dan tidak dapat dihapus.');
      }
    }

    await deleteUserRepository.delete(targetUser.id);

    return {
      success: true,
      message: `Akun amil "${targetUser.name}" (@${targetUser.username}) berhasil dihapus secara permanen.`,
      data: {
        deletedUserId: targetUser.id,
        deletedName: targetUser.name,
      },
    };
  }
}

export const deleteUserUseCase = new DeleteUserUseCase();
