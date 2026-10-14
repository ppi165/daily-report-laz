import { userRepository } from '../repositories/user.repository';
import { verifyJWT } from '@/src/infrastructure/auth';

export class GetCurrentUserUseCase {
  async execute(token?: string) {
    if (!token) {
      throw new Error('Unauthorized: Sesi tidak ditemukan');
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Unauthorized: Token tidak valid');
    }

    const user = await userRepository.findById(decoded.userId as string);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }

    return user;
  }
}

export const getCurrentUserUseCase = new GetCurrentUserUseCase();
