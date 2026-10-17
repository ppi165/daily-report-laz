import { approvalRepository, ApprovalRepository } from "../repositories/approval.repository";
import { ReviseClockInInput } from "../schemas/revise-clock-in.schema";

export class ReviseClockInUseCase {
  constructor(private readonly repo: ApprovalRepository = approvalRepository) {}

  async execute(input: ReviseClockInInput, userId: string) {
    const report = await this.repo.findReportById(input.reportId);
    if (!report) {
      throw new Error("Laporan tidak ditemukan.");
    }

    if (!report.isClockIn) {
      throw new Error("Hanya laporan Clock-in yang dapat direvisi melalui alur ini.");
    }

    if (report.authorId !== userId) {
      throw new Error("Anda tidak memiliki izin untuk merevisi laporan ini.");
    }

    if (report.status !== "REJECTED" && report.status !== "PENDING_APPROVAL") {
      throw new Error("Laporan yang sudah diterbitkan tidak dapat direvisi.");
    }

    await this.repo.reviseReport(input.reportId, input.content, input.attachments);

    return {
      success: true,
      message: "Laporan berhasil direvisi dan diajukan ulang ke verifikator.",
    };
  }
}

export const reviseClockInUseCase = new ReviseClockInUseCase();
