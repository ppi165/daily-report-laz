import { divisionRepository } from '../repositories/division.repository';

export class GetDivisionsUseCase {
  async execute() {
    return divisionRepository.findAllWithMemberCount();
  }
}

export const getDivisionsUseCase = new GetDivisionsUseCase();
