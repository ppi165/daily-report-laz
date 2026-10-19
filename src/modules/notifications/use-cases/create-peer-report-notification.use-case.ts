import { userRepository } from "@/src/modules/users/repositories/user.repository";
import { notificationRepository } from "../repositories/notification.repository";

export class CreatePeerReportNotificationUseCase {
  async execute(input: {
    reportId: string;
    authorId: string;
    authorName: string;
    division: string;
  }) {
    const { reportId, authorId, authorName, division } = input;

    if (!division) return;

    // Cari rekan kerja di divisi yang sama via repository
    const peers = await userRepository.findPeersByDivision(division, authorId);

    if (peers.length === 0) return;

    // 1 Query batch createMany menggantikan loop insert individual
    const notificationsToCreate = peers.map((peer) => ({
      userId: peer.id,
      type: "PEER_REPORT",
      title: "Laporan Rekan Sedivisi",
      message: `${authorName} (Divisi ${division}) telah mempublikasikan daily report hari ini.`,
      link: `/feed#report-${reportId}`,
      reportId,
      actorId: authorId,
    }));

    await notificationRepository.createMany(notificationsToCreate);
  }
}

export const createPeerReportNotificationUseCase =
  new CreatePeerReportNotificationUseCase();
