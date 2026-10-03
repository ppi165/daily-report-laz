import { ReportRepository } from '../repositories/ReportRepository';

const reportRepository = new ReportRepository();

export class ReportService {
  async createReport(data: { title?: string; content: string; division: string; authorId: string; attachments?: string[] }) {
    if (!data.content || !data.division) {
      return { success: false, message: 'Konten dan divisi laporan wajib diisi' };
    }

    try {
      const report = await reportRepository.create({
        title: data.title || '',
        content: data.content,
        division: data.division,
        authorId: data.authorId,
        attachments: data.attachments || [],
        status: 'PUBLISHED',
        appreciations: 0
      });
      return { success: true, message: 'Laporan berhasil disimpan', data: report };
    } catch (error: any) {
      return { success: false, message: 'Gagal menyimpan laporan', error: error.message };
    }
  }

  async getAllReports(filters?: any) {
    try {
      // Kita dapat menambahkan filter pencarian atau divisi di sini nanti
      const reports = await reportRepository.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: reports };
    } catch (error: any) {
      return { success: false, message: 'Gagal mengambil laporan', error: error.message };
    }
  }
}
