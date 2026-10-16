import { divisionRepository } from '../repositories/division.repository';
import { MoveUserDivisionInput, MoveUserDivisionSchema } from '../schemas/move-user-division.schema';

export class MoveUserDivisionUseCase {
  async execute(input: MoveUserDivisionInput) {
    const validated = MoveUserDivisionSchema.parse(input);

    const targetDivision = await divisionRepository.findByName(validated.newDivision);
    if (!targetDivision) {
      throw new Error(`Divisi tujuan "${validated.newDivision}" tidak ditemukan.`);
    }

    return divisionRepository.updateUserDivision(
      validated.userId,
      validated.newDivision,
      validated.newPosition
    );
  }
}

export const moveUserDivisionUseCase = new MoveUserDivisionUseCase();
