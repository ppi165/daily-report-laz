import { notificationRepository } from "../repositories/notification.repository";
import { reportRepository } from "@/src/modules/reports/repositories/report.repository";
import { feedRepository } from "@/src/modules/feed/repositories/feed.repository";

export class CreateCommentNotificationUseCase {
  async execute(input: {
    reportId: string;
    commentId: string;
    actorId: string;
    actorName: string;
    parentId?: string | null;
  }) {
    const { reportId, commentId, actorId, actorName, parentId } = input;

    const report = await reportRepository.findById(reportId);
    if (!report) return null;

    const titlePreview =
      report.title ||
      (report.content.length > 35
        ? `${report.content.substring(0, 35)}...`
        : report.content);

    // Kasus 1: Balasan komentar (COMMENT_REPLY)
    if (parentId) {
      const parentComment = await feedRepository.findCommentById(parentId);
      if (parentComment && parentComment.userId !== actorId) {
        await notificationRepository.create({
          userId: parentComment.userId,
          type: "COMMENT_REPLY",
          title: "Balasan Komentar",
          message: `${actorName} membalas komentar Anda pada laporan: "${titlePreview}"`,
          link: `/feed#report-${reportId}`,
          reportId,
          actorId,
          metadata: { commentId, parentId },
        });
      }

      // Jika pembuat laporan bukan pengirim balasan dan bukan pemilik komentar induk,
      // pembuat laporan juga diberi notifikasi komentar baru
      if (
        report.authorId !== actorId &&
        (!parentComment || report.authorId !== parentComment.userId)
      ) {
        await notificationRepository.create({
          userId: report.authorId,
          type: "COMMENT",
          title: "Komentar Baru",
          message: `${actorName} mengomentari laporan Anda: "${titlePreview}"`,
          link: `/feed#report-${reportId}`,
          reportId,
          actorId,
          metadata: { commentId },
        });
      }

      return;
    }

    // Kasus 2: Komentar baru pada laporan (COMMENT)
    if (report.authorId !== actorId) {
      await notificationRepository.create({
        userId: report.authorId,
        type: "COMMENT",
        title: "Komentar Baru",
        message: `${actorName} mengomentari laporan Anda: "${titlePreview}"`,
        link: `/feed#report-${reportId}`,
        reportId,
        actorId,
        metadata: { commentId },
      });
    }
  }
}

export const createCommentNotificationUseCase =
  new CreateCommentNotificationUseCase();
