import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { ChangePasswordInput, ChangePasswordSchema } from '../schemas/change-password.schema';

export class ChangePasswordUseCase {
  async execute(input: ChangePasswordInput, userId: string) {
    const validated = ChangePasswordSchema.parse(input);

    if (!userId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid');
    }

    const user = await userRepository.findWithPasswordById(userId);
    if (!user) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    // Verifikasi password saat ini
    const isCurrentValid = await bcrypt.compare(validated.currentPassword, user.password);
    if (!isCurrentValid) {
      throw new Error('Password saat ini tidak sesuai.');
    }

    // Pastikan password baru tidak sama persis dengan password lama
    const isSame = await bcrypt.compare(validated.newPassword, user.password);
    if (isSame) {
      throw new Error('Password baru tidak boleh sama dengan password saat ini.');
    }

    // Hash password baru dan simpan ke database
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui.',
    };
  }
}

export const changePasswordUseCase = new ChangePasswordUseCase();
