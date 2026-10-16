import { divisionRepository } from '../repositories/division.repository';

export class GetUsersForMutationUseCase {
  async execute() {
    return divisionRepository.getAllUsers();
  }
}

export const getUsersForMutationUseCase = new GetUsersForMutationUseCase();
