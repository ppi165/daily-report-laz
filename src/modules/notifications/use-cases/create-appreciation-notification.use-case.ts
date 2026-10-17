import { notificationRepository } from "../repositories/notification.repository";
import { reportRepository } from "@/src/modules/reports/repositories/report.repository";
import { feedRepository } from "@/src/modules/feed/repositories/feed.repository";

export class CreateAppreciationNotificationUseCase {
  async execute(input: {
    reportId: string;
    actorId: string;
    actorName: string;
  }) {
    const { reportId, actorId, actorName } = input;

    // Ambil data laporan penerima
    const report = await reportRepository.findById(reportId);

    if (!report || report.authorId === actorId) {
      // Tidak ada laporan atau pengguna mengapresiasi laporannya sendiri
      return null;
    }

    const titlePreview = report.title || (report.content.length > 35 ? `${report.content.substring(0, 35)}...` : report.content);
    const existing = await notificationRepository.findAppreciationNotification(report.authorId, reportId);

    // Ambil jumlah like riil terkini dari database
    const totalLiker = await feedRepository.countAppreciations(reportId);

    // Cari nama liker lain jika total like == 2
    let secondLikerName: string | null = null;
    if (totalLiker === 2) {
      const secondLiker = await feedRepository.findSecondAppreciation(reportId, actorId);
      secondLikerName = secondLiker?.user?.name || "1 rekan lainnya";
    }

    let dynamicMessage = `${actorName} menyukai laporan Anda: "${titlePreview}"`;
    if (totalLiker === 2 && secondLikerName) {
      dynamicMessage = `${actorName} dan ${secondLikerName} menyukai laporan Anda: "${titlePreview}"`;
    } else if (totalLiker > 2) {
      const others = totalLiker - 1;
      dynamicMessage = `${actorName} dan ${others} lainnya menyukai laporan Anda: "${titlePreview}"`;
    }

    if (!existing) {
      // Buat notifikasi like baru pertama
      return notificationRepository.create({
        userId: report.authorId,
        type: "APPRECIATION",
        title: "Apresiasi Baru",
        message: dynamicMessage,
        link: `/feed#report-${reportId}`,
        reportId,
        actorId,
        metadata: {
          totalLiker,
          lastActorName: actorName,
        },
      });
    }

    return notificationRepository.update(existing.id, {
      message: dynamicMessage,
      link: `/feed#report-${reportId}`,
      actorId,
      isRead: false,
      readAt: null,
      updatedAt: new Date(),
      metadata: {
        totalLiker,
        lastActorName: actorName,
      },
    });
  }
}

export const createAppreciationNotificationUseCase = new CreateAppreciationNotificationUseCase();
