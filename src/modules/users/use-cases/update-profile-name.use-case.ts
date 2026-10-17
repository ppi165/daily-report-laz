import { userRepository } from '../repositories/user.repository';
import { UpdateProfileNameInput, UpdateProfileNameSchema } from '../schemas/update-profile-name.schema';

export class UpdateProfileNameUseCase {
  async execute(input: UpdateProfileNameInput, userId: string) {
    const validated = UpdateProfileNameSchema.parse(input);

    if (!userId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    const updated = await userRepository.updateName(userId, validated.name);

    return {
      success: true,
      message: 'Nama amil berhasil diperbarui.',
      data: updated,
    };
  }
}

export const updateProfileNameUseCase = new UpdateProfileNameUseCase();
