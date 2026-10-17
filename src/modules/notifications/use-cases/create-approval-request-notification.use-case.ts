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

    const promises = uniqueApprovers.map((approverId) =>
      notificationRepository.create({
        userId: approverId,
        type: "APPROVAL_REQUEST",
        title: "Permintaan Verifikasi Clock-in",
        message: `${authorName} menunjuk Anda sebagai saksi verifikasi Clock-in. Mohon tinjau laporan tersebut.`,
        link: "/verifikasi",
        reportId,
        actorId: authorId,
      })
    );

    await Promise.allSettled(promises);
  }
}

export const createApprovalRequestNotificationUseCase =
  new CreateApprovalRequestNotificationUseCase();
