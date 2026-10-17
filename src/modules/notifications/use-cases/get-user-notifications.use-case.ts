import { notificationRepository } from "../repositories/notification.repository";

export class GetUserNotificationsUseCase {
  async execute(userId: string) {
    if (!userId) {
      return { notifications: [], unreadCount: 0 };
    }

    const [rawNotifications, unreadCount] = await Promise.all([
      notificationRepository.findByUserId(userId),
      notificationRepository.countUnread(userId),
    ]);

    const notifications = rawNotifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      readAt: n.readAt ? n.readAt.toISOString() : null,
      metadata: (n.metadata as Record<string, unknown>) || null,
    }));

    return {
      notifications,
      unreadCount,
    };
  }
}

export const getUserNotificationsUseCase = new GetUserNotificationsUseCase();
