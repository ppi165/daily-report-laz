import { feedRepository, FeedRepository } from "../repositories/feed.repository";
import { ToggleAppreciationInput } from "../schemas/toggle-appreciation.schema";
import { createAppreciationNotificationUseCase } from "@/src/modules/notifications/use-cases/create-appreciation-notification.use-case";
import { removeAppreciationNotificationUseCase } from "@/src/modules/notifications/use-cases/remove-appreciation-notification.use-case";
import { userRepository } from "@/src/modules/users";

export class ToggleAppreciationUseCase {
  constructor(private readonly repo: FeedRepository = feedRepository) {}

  async execute(input: ToggleAppreciationInput, userId: string) {
    const existing = await this.repo.findAppreciation(input.reportId, userId);

    if (existing) {
      await this.repo.removeAppreciation(input.reportId, userId);

      // Sinkronisasi/hapus notifikasi like saat batal like (Unlike)
      try {
        await removeAppreciationNotificationUseCase.execute({
          reportId: input.reportId,
          actorId: userId,
        });
      } catch (err) {
        console.error("Gagal sinkronisasi notifikasi unlike:", err);
      }

      return { liked: false };
    } else {
      await this.repo.addAppreciation(input.reportId, userId);

      // Picu notifikasi agregasi like ala Instagram ke pemilik laporan
      try {
        const actor = await userRepository.findById(userId);
        if (actor) {
          await createAppreciationNotificationUseCase.execute({
            reportId: input.reportId,
            actorId: userId,
            actorName: actor.name,
          });
        }
      } catch (err) {
        console.error("Gagal membuat notifikasi like:", err);
      }

      return { liked: true };
    }
  }
}

export const toggleAppreciationUseCase = new ToggleAppreciationUseCase();
