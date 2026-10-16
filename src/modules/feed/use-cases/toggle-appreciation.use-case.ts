import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { ToggleAppreciationInput } from "../schemas/toggle-appreciation.schema";

export class ToggleAppreciationUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: ToggleAppreciationInput, userId: string) {
    const existing = await this.repo.findAppreciation(input.reportId, userId);

    if (existing) {
      await this.repo.removeAppreciation(input.reportId, userId);
      return { liked: false };
    } else {
      await this.repo.addAppreciation(input.reportId, userId);
      return { liked: true };
    }
  }
}

export const toggleAppreciationUseCase = new ToggleAppreciationUseCase();
