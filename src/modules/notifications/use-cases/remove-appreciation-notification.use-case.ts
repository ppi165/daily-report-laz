import { notificationRepository } from "../repositories/notification.repository";
import { reportRepository } from "@/src/modules/reports/repositories/report.repository";
import { feedRepository } from "@/src/modules/feed/repositories/feed.repository";

export class RemoveAppreciationNotificationUseCase {
  async execute(input: { reportId: string; actorId: string }) {
    const { reportId, actorId } = input;

    const report = await reportRepository.findById(reportId);
    if (!report || report.authorId === actorId) {
      return null;
    }

    const existing = await notificationRepository.findAppreciationNotification(
      report.authorId,
      reportId
    );
    if (!existing) {
      return null;
    }

    const totalLiker = await feedRepository.countAppreciations(reportId);

    if (totalLiker === 0) {
      // Hapus notifikasi jika seluruh like sudah dibatalkan
      return notificationRepository.delete(existing.id);
    }

    // Ambil liker terkini yang tersisa
    const latestLiker = await feedRepository.findLatestAppreciation(reportId);
    if (!latestLiker || !latestLiker.user) {
      return notificationRepository.delete(existing.id);
    }

    const titlePreview =
      report.title ||
      (report.content.length > 35
        ? `${report.content.substring(0, 35)}...`
        : report.content);

    let secondLikerName: string | null = null;
    if (totalLiker === 2) {
      const secondLiker = await feedRepository.findSecondAppreciation(
        reportId,
        latestLiker.user.id
      );
      secondLikerName = secondLiker?.user?.name || "1 rekan lainnya";
    }

    let dynamicMessage = `${latestLiker.user.name} menyukai laporan Anda: "${titlePreview}"`;
    if (totalLiker === 2 && secondLikerName) {
      dynamicMessage = `${latestLiker.user.name} dan ${secondLikerName} menyukai laporan Anda: "${titlePreview}"`;
    } else if (totalLiker > 2) {
      const others = totalLiker - 1;
      dynamicMessage = `${latestLiker.user.name} dan ${others} lainnya menyukai laporan Anda: "${titlePreview}"`;
    }

    return notificationRepository.update(existing.id, {
      message: dynamicMessage,
      actorId: latestLiker.user.id,
      metadata: {
        totalLiker,
        lastActorName: latestLiker.user.name,
      },
    });
  }
}

export const removeAppreciationNotificationUseCase =
  new RemoveAppreciationNotificationUseCase();
