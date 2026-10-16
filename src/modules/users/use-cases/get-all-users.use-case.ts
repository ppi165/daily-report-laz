import { userRepository } from '../repositories/user.repository';

export interface UserFilterOptions {
  division?: string;
  role?: string;
  search?: string;
}

export class GetAllUsersUseCase {
  async execute(filters?: UserFilterOptions) {
    const [users, stats] = await Promise.all([
      userRepository.findAllWithFilters(filters),
      userRepository.countByRoles(),
    ]);

    return {
      users,
      stats,
    };
  }
}

export const getAllUsersUseCase = new GetAllUsersUseCase();
