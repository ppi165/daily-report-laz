import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { AddCommentInput } from "../schemas/add-comment.schema";

export class AddCommentUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: AddCommentInput, userId: string) {
    return this.repo.createComment(input.reportId, userId, input.content);
  }
}

export const addCommentUseCase = new AddCommentUseCase();
