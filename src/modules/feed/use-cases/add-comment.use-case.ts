import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { AddCommentInput } from "../schemas/add-comment.schema";
import { createCommentMentionNotificationUseCase } from "@/src/modules/notifications/use-cases/create-comment-mention-notification.use-case";
import { prisma } from "@/src/infrastructure/prisma";

export class AddCommentUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: AddCommentInput, userId: string) {
    const comment = await this.repo.createComment(
      input.reportId,
      userId,
      input.content,
      input.parentId
    );

    // Picu notifikasi sebutan (@Nama / @username) jika terdapat tag di dalam komentar
    if (input.content && input.content.includes("@")) {
      try {
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        if (actor) {
          await createCommentMentionNotificationUseCase.execute({
            reportId: input.reportId,
            actorId: userId,
            actorName: actor.name,
            commentContent: input.content,
          });
        }
      } catch (err) {
        console.error("Gagal mengirim notifikasi sebutan pada komentar baru:", err);
      }
    }

    return comment;
  }
}

export const addCommentUseCase = new AddCommentUseCase();
