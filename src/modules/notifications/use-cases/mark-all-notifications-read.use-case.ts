import { notificationRepository } from "../repositories/notification.repository";

export class MarkAllNotificationsReadUseCase {
  async execute(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return notificationRepository.markAllAsRead(userId);
  }
}

export const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase();
