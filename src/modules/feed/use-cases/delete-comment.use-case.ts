import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { DeleteCommentInput } from "../schemas/delete-comment.schema";
import { notificationRepository } from "@/src/modules/notifications/repositories/notification.repository";

export class DeleteCommentUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: DeleteCommentInput, currentUserId: string, currentUserRole?: string) {
    const comment = await this.repo.findCommentById(input.commentId);
    if (!comment) {
      throw new Error("Komentar tidak ditemukan.");
    }

    const isAuthor = comment.userId === currentUserId;
    const isModerator = currentUserRole === "SUPERADMIN" || currentUserRole === "ADMIN";

    if (!isAuthor && !isModerator) {
      throw new Error("Anda tidak memiliki izin untuk menghapus komentar ini.");
    }

    const result = await this.repo.deleteComment(input.commentId);

    // Hapus notifikasi terkait komentar ini (COMMENT, COMMENT_REPLY, COMMENT_MENTION)
    try {
      await notificationRepository.deleteByCommentId(input.commentId);
    } catch (err) {
      console.error("Gagal menghapus notifikasi terkait komentar:", err);
    }

    return result;
  }
}

export const deleteCommentUseCase = new DeleteCommentUseCase();
