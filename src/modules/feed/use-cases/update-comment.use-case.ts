import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { UpdateCommentInput } from "../schemas/update-comment.schema";

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

    return this.repo.updateComment(input.commentId, input.content);
  }
}

export const updateCommentUseCase = new UpdateCommentUseCase();
