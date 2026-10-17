import { notificationRepository } from "../repositories/notification.repository";
import { MarkAsReadInput, MarkAsReadSchema } from "../schemas/notification.schema";

export class MarkNotificationReadUseCase {
  async execute(input: MarkAsReadInput, userId: string) {
    const validated = MarkAsReadSchema.parse(input);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return notificationRepository.markAsRead(validated.notificationId);
  }
}

export const markNotificationReadUseCase = new MarkNotificationReadUseCase();
