import { prisma } from "@/src/infrastructure/prisma";
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

    // Cari rekan kerja yang berada di divisi yang sama (kecuali pembuat laporan)
    const peers = await prisma.user.findMany({
      where: {
        division: { equals: division, mode: "insensitive" },
        id: { not: authorId },
      },
      select: { id: true },
    });

    if (peers.length === 0) return;

    // Buat notifikasi untuk setiap rekan sedivisi
    const promises = peers.map((peer) =>
      notificationRepository.create({
        userId: peer.id,
        type: "PEER_REPORT",
        title: "Laporan Rekan Sedivisi",
        message: `${authorName} (Divisi ${division}) telah mempublikasikan daily report hari ini.`,
        link: `/feed#report-${reportId}`,
        reportId,
        actorId: authorId,
      })
    );

    await Promise.allSettled(promises);
  }
}

export const createPeerReportNotificationUseCase = new CreatePeerReportNotificationUseCase();
