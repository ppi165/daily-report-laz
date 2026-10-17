import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { UpdateCommentInput } from "../schemas/update-comment.schema";
import { createCommentMentionNotificationUseCase } from "@/src/modules/notifications/use-cases/create-comment-mention-notification.use-case";
import { userRepository } from "@/src/modules/users";

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

    const oldContent = comment.content;
    const updated = await this.repo.updateComment(input.commentId, input.content);

    // Picu notifikasi sebutan (@Nama / @username) jika komentar memuat tag baru (cegah duplikasi)
    if (input.content && input.content.includes("@")) {
      try {
        const actor = await userRepository.findById(currentUserId);
        if (actor) {
          await createCommentMentionNotificationUseCase.execute({
            reportId: comment.reportId,
            actorId: currentUserId,
            actorName: actor.name,
            commentContent: input.content,
            oldCommentContent: oldContent,
            commentId: comment.id,
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
