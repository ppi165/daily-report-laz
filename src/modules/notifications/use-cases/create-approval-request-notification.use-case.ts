import { notificationRepository } from "../repositories/notification.repository";

export class CreateApprovalRequestNotificationUseCase {
  async execute(input: {
    reportId: string;
    authorId: string;
    authorName: string;
    approverUserIds: string[];
  }) {
    const { reportId, authorId, authorName, approverUserIds } = input;

    const uniqueApprovers = Array.from(new Set(approverUserIds)).filter(
      (id) => Boolean(id) && id !== authorId
    );

    if (uniqueApprovers.length === 0) return;

    await notificationRepository.createMany(
      uniqueApprovers.map((approverId) => ({
        userId: approverId,
        type: "APPROVAL_REQUEST",
        title: "Permintaan Verifikasi Clock-in",
        message: `${authorName} menunjuk Anda sebagai saksi verifikasi Clock-in. Mohon tinjau laporan tersebut.`,
        link: `/verifikasi#report-${reportId}`,
        reportId,
        actorId: authorId,
      }))
    );
  }
}

export const createApprovalRequestNotificationUseCase =
  new CreateApprovalRequestNotificationUseCase();
