import { prisma } from "@/src/infrastructure/prisma";
import { notificationRepository } from "../repositories/notification.repository";

export class CreateCommentMentionNotificationUseCase {
  async execute(input: {
    reportId: string;
    actorId: string;
    actorName: string;
    commentContent: string;
  }) {
    const { reportId, actorId, actorName, commentContent } = input;

    if (!commentContent || !commentContent.includes("@")) {
      return;
    }

    // Ambil seluruh user amil terdaftar untuk mencocokkan tag nama (@Nama Lengkap) maupun @username
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: actorId }, // Jangan notifikasi ke diri sendiri
      },
      select: { id: true, name: true, username: true },
    });

    if (allUsers.length === 0) {
      return;
    }

    const contentLower = commentContent.toLowerCase();

    // Cocokkan apakah komentar memuat @Nama (seperti yang di-insert oleh pop-up autocomplete) atau @username
    const mentionedUserIds = new Set<string>();

    for (const u of allUsers) {
      const nameTag = `@${u.name.trim().toLowerCase()}`;
      const usernameTag = `@${u.username.trim().toLowerCase()}`;

      if (contentLower.includes(nameTag) || contentLower.includes(usernameTag)) {
        mentionedUserIds.add(u.id);
      }
    }

    if (mentionedUserIds.size === 0) {
      return;
    }

    // Buat notifikasi tag untuk masing-masing user yang disebut
    // Format pesan: Hanya info sebutan tanpa menampilkan kutipan teks komentar
    const promises = Array.from(mentionedUserIds).map((targetUserId) =>
      notificationRepository.create({
        userId: targetUserId,
        type: "COMMENT_MENTION",
        title: "Sebutan Baru",
        message: `${actorName} menyebut Anda dalam sebuah komentar.`,
        link: `/feed#report-${reportId}`,
        reportId,
        actorId,
      })
    );

    await Promise.allSettled(promises);
  }
}

export const createCommentMentionNotificationUseCase =
  new CreateCommentMentionNotificationUseCase();
