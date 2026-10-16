import { divisionRepository } from '../repositories/division.repository';

export class DeleteDivisionUseCase {
  async execute(id: string) {
    if (!id) {
      throw new Error('ID divisi wajib disertakan.');
    }

    const division = await divisionRepository.findById(id);
    if (!division) {
      throw new Error('Divisi tidak ditemukan.');
    }

    const memberCount = await divisionRepository.countUsersInDivision(division.name);
    if (memberCount > 0) {
      throw new Error(
        `Tidak dapat menghapus bidang "${division.name}" karena masih memiliki ${memberCount} pegawai aktif. Silakan mutasikan pegawai terlebih dahulu.`
      );
    }

    return divisionRepository.delete(id);
  }
}

export const deleteDivisionUseCase = new DeleteDivisionUseCase();
