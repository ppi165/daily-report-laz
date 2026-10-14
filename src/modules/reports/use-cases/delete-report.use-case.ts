import { reportRepository } from '../repositories/report.repository';

export class DeleteReportUseCase {
  async execute(id: string) {
    if (!id) {
      throw new Error('ID laporan wajib diisi');
    }
    return reportRepository.delete(id);
  }
}

export const deleteReportUseCase = new DeleteReportUseCase();
