import { divisionRepository } from '../repositories/division.repository';
import { CreateDivisionInput, CreateDivisionSchema } from '../schemas/create-division.schema';

export class CreateDivisionUseCase {
  async execute(input: CreateDivisionInput) {
    const validated = CreateDivisionSchema.parse(input);

    const existing = await divisionRepository.findByName(validated.name);
    if (existing) {
      throw new Error(`Bidang "${validated.name}" sudah terdaftar.`);
    }

    return divisionRepository.create({
      name: validated.name,
      description: validated.description || '',
      leaderName: validated.leaderName || '',
    });
  }
}

export const createDivisionUseCase = new CreateDivisionUseCase();
