import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { AddCommentInput } from "../schemas/add-comment.schema";
import { createCommentMentionNotificationUseCase } from "@/src/modules/notifications/use-cases/create-comment-mention-notification.use-case";
import { createCommentNotificationUseCase } from "@/src/modules/notifications/use-cases/create-comment-notification.use-case";
import { userRepository } from "@/src/modules/users";

export class AddCommentUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: AddCommentInput, userId: string) {
    const comment = await this.repo.createComment(
      input.reportId,
      userId,
      input.content,
      input.parentId
    );

    try {
      const actor = await userRepository.findById(userId);
      if (actor) {
        // 1. Picu notifikasi komentar/balasan untuk pemilik laporan atau pemilik komentar induk
        await createCommentNotificationUseCase.execute({
          reportId: input.reportId,
          commentId: comment.id,
          actorId: userId,
          actorName: actor.name,
          parentId: input.parentId,
        });

        // 2. Picu notifikasi sebutan (@Nama / @username) jika terdapat tag di dalam komentar
        if (input.content && input.content.includes("@")) {
          await createCommentMentionNotificationUseCase.execute({
            reportId: input.reportId,
            actorId: userId,
            actorName: actor.name,
            commentContent: input.content,
            commentId: comment.id,
          });
        }
      }
    } catch (err) {
      console.error("Gagal mengirim notifikasi komentar:", err);
    }

    return comment;
  }
}

export const addCommentUseCase = new AddCommentUseCase();
