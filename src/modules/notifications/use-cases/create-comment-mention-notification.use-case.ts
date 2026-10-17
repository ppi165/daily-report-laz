import { userRepository } from "@/src/modules/users";
import { notificationRepository } from "../repositories/notification.repository";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMentionedUserIds(
  content: string,
  users: Array<{ id: string; name: string; username: string }>
): Set<string> {
  const mentioned = new Set<string>();
  for (const u of users) {
    const escapedName = escapeRegex(u.name.trim());
    const escapedUsername = escapeRegex(u.username.trim());

    // Cocokkan @nama atau @username dengan pembatas akhir kata / non-alphanumeric
    const nameRegex = new RegExp(`@${escapedName}(?=[^a-zA-Z0-9_]|$)`, "i");
    const usernameRegex = new RegExp(`@${escapedUsername}(?=[^a-zA-Z0-9_]|$)`, "i");

    if (nameRegex.test(content) || usernameRegex.test(content)) {
      mentioned.add(u.id);
    }
  }
  return mentioned;
}

export class CreateCommentMentionNotificationUseCase {
  async execute(input: {
    reportId: string;
    actorId: string;
    actorName: string;
    commentContent: string;
    oldCommentContent?: string;
    commentId?: string;
  }) {
    const {
      reportId,
      actorId,
      actorName,
      commentContent,
      oldCommentContent,
      commentId,
    } = input;

    if (!commentContent || !commentContent.includes("@")) {
      return;
    }

    // Ambil seluruh user amil terdaftar via repository
    const allUsers = await userRepository.findMentionUsers();
    const eligibleUsers = allUsers.filter((u) => u.id !== actorId);

    if (eligibleUsers.length === 0) {
      return;
    }

    const currentMentionedIds = extractMentionedUserIds(
      commentContent,
      eligibleUsers
    );

    if (currentMentionedIds.size === 0) {
      return;
    }

    // Jika komentar diedit (oldCommentContent ada), hanya beri notifikasi pada pengguna baru yang di-tag
    let targetUserIds = Array.from(currentMentionedIds);
    if (oldCommentContent && oldCommentContent.includes("@")) {
      const previouslyMentionedIds = extractMentionedUserIds(
        oldCommentContent,
        eligibleUsers
      );
      targetUserIds = targetUserIds.filter(
        (id) => !previouslyMentionedIds.has(id)
      );
    }

    if (targetUserIds.length === 0) {
      return;
    }

    // Buat batch notifikasi dengan 1 single query (createMany)
    const notificationsToCreate = targetUserIds.map((targetUserId) => ({
      userId: targetUserId,
      type: "COMMENT_MENTION",
      title: "Sebutan Baru",
      message: `${actorName} menyebut Anda dalam sebuah komentar.`,
      link: `/feed#report-${reportId}`,
      reportId,
      actorId,
      metadata: commentId ? { commentId } : undefined,
    }));

    await notificationRepository.createMany(notificationsToCreate);
  }
}

export const createCommentMentionNotificationUseCase =
  new CreateCommentMentionNotificationUseCase();
