import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { UpdateCommentInput } from "../schemas/update-comment.schema";
import { createCommentMentionNotificationUseCase } from "@/src/modules/notifications/use-cases/create-comment-mention-notification.use-case";
import { prisma } from "@/src/infrastructure/prisma";

export class UpdateCommentUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: UpdateCommentInput, currentUserId: string) {
    const comment = await this.repo.findCommentById(input.commentId);
    if (!comment) {
      throw new Error("Komentar tidak ditemukan.");
    }

    if (comment.userId !== currentUserId) {
      throw new Error("Anda tidak memiliki izin untuk mengedit komentar ini.");
    }

    const updated = await this.repo.updateComment(input.commentId, input.content);

    // Picu notifikasi sebutan (@Nama / @username) jika komentar memuat tag baru
    if (input.content && input.content.includes("@")) {
      try {
        const actor = await prisma.user.findUnique({
          where: { id: currentUserId },
          select: { name: true },
        });
        if (actor) {
          await createCommentMentionNotificationUseCase.execute({
            reportId: comment.reportId,
            actorId: currentUserId,
            actorName: actor.name,
            commentContent: input.content,
          });
        }
      } catch (err) {
        console.error("Gagal mengirim notifikasi sebutan pada edit komentar:", err);
      }
    }

    return updated;
  }
}

export const updateCommentUseCase = new UpdateCommentUseCase();
