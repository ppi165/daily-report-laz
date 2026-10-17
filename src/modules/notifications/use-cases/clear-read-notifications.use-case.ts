import { notificationRepository } from "../repositories/notification.repository";

export class ClearReadNotificationsUseCase {
  async execute(userId: string) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await notificationRepository.clearAllRead(userId);
    return {
      success: true,
      deletedCount: result.count,
    };
  }
}

export const clearReadNotificationsUseCase = new ClearReadNotificationsUseCase();
