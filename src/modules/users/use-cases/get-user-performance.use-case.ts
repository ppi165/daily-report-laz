import { userRepository } from '../repositories/user.repository';

export class GetUserPerformanceUseCase {
  async execute(userId: string) {
    if (!userId) {
      throw new Error('Unauthorized: Sesi pengguna tidak valid');
    }

    const performance = await userRepository.getUserPerformance(userId);
    return performance;
  }
}

export const getUserPerformanceUseCase = new GetUserPerformanceUseCase();
