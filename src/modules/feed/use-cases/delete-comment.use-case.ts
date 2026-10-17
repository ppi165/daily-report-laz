import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { DeleteCommentInput } from "../schemas/delete-comment.schema";

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

    return this.repo.deleteComment(input.commentId);
  }
}

export const deleteCommentUseCase = new DeleteCommentUseCase();
