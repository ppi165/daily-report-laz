import { userRepository } from '../repositories/user.repository';
import { storageService } from '@/src/infrastructure/storage/storage.service';

export class DeleteAvatarUseCase {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid.');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    if (!user.avatar) {
      return {
        success: true,
        message: 'Pengguna saat ini belum memasang foto profil khusus.',
        data: { avatar: null },
      };
    }

    // Bersihkan berkas fisik dari Supabase Storage jika merupakan URL internal
    try {
      await storageService.deleteImage(user.avatar);
    } catch {
      // Abaikan jika berkas sudah tidak ada di storage
    }

    const updated = await userRepository.updateAvatar(userId, null);

    return {
      success: true,
      message: 'Foto profil berhasil dihapus dan dikembalikan ke inisial nama.',
      data: updated,
    };
  }
}

export const deleteAvatarUseCase = new DeleteAvatarUseCase();
