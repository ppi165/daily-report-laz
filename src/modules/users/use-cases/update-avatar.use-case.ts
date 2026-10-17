import { userRepository } from '../repositories/user.repository';
import { UpdateAvatarInput, UpdateAvatarSchema } from '../schemas/update-avatar.schema';

export class UpdateAvatarUseCase {
  async execute(input: UpdateAvatarInput, userId: string) {
    const validated = UpdateAvatarSchema.parse(input);

    if (!userId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    const updated = await userRepository.updateAvatar(userId, validated.avatarUrl);

    return {
      success: true,
      message: 'Foto profil berhasil diperbarui.',
      data: updated,
    };
  }
}

export const updateAvatarUseCase = new UpdateAvatarUseCase();
