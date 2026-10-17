import { userRepository, UserRepository } from "../repositories/user.repository";

export interface MentionUserItem {
  id: string;
  name: string;
  username: string;
  division: string;
  role: string;
  avatar?: string | null;
}

export class GetMentionUsersUseCase {
  constructor(private readonly repo: UserRepository = userRepository) {}

  async execute(): Promise<MentionUserItem[]> {
    return this.repo.findMentionUsers();
  }
}

export const getMentionUsersUseCase = new GetMentionUsersUseCase();
