import { userRepository } from '../repositories/user.repository';
import { UpdateUserInput, UpdateUserSchema } from '../schemas/update-user.schema';

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

    // Aturan Hierarki Proteksi Role:
    if (actor.role === 'ADMIN') {
      if (targetUser.role === 'SUPERADMIN') {
        throw new Error('Pelanggaran hak akses: Akun Superadmin dilindungi dan tidak dapat diubah oleh Admin.');
      }
      if (targetUser.role === 'ADMIN' && targetUser.id !== actor.id && validated.role !== 'ADMIN') {
        throw new Error('Pelanggaran hak akses: Hanya Superadmin yang berwenang mencabut status Admin pimpinan lain.');
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

    // Proteksi Absolut Akun Superadmin: Role Superadmin tidak boleh di-downgrade secara tidak sengaja
    const finalRole = targetUser.role === 'SUPERADMIN' ? 'SUPERADMIN' : validated.role;

    const updated = await userRepository.updateUser(targetUser.id, {
      name: validated.name.trim(),
      username: validated.username.toLowerCase().trim(),
      email: validated.email.toLowerCase().trim(),
      division: validated.division,
      position: validated.position.trim(),
      role: finalRole,
    });

    return {
      success: true,
      message: `Data amil '${updated.name}' berhasil diperbarui.`,
      data: updated,
    };
  }
}

export const updateUserUseCase = new UpdateUserUseCase();
