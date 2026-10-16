import { divisionRepository } from '../repositories/division.repository';
import { UpdateDivisionInput, UpdateDivisionSchema } from '../schemas/update-division.schema';

export class UpdateDivisionUseCase {
  async execute(input: UpdateDivisionInput) {
    const validated = UpdateDivisionSchema.parse(input);

    const existing = await divisionRepository.findById(validated.id);
    if (!existing) {
      throw new Error('Data divisi tidak ditemukan.');
    }

    if (validated.name !== existing.name) {
      const nameConflict = await divisionRepository.findByName(validated.name);
      if (nameConflict) {
        throw new Error(`Nama bidang "${validated.name}" sudah digunakan.`);
      }
    }

    return divisionRepository.update(validated.id, {
      name: validated.name,
      description: validated.description || '',
      leaderName: validated.leaderName || '',
    });
  }
}

export const updateDivisionUseCase = new UpdateDivisionUseCase();
