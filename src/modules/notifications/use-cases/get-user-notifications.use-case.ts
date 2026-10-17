import { notificationRepository } from "../repositories/notification.repository";

export class GetUserNotificationsUseCase {
  async execute(userId: string) {
    if (!userId) {
      return { notifications: [], unreadCount: 0 };
    }

    const rawNotifications = await notificationRepository.findByUserId(userId);

    const notifications = rawNotifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      readAt: n.readAt ? n.readAt.toISOString() : null,
      metadata: (n.metadata as Record<string, unknown>) || null,
    }));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
      notifications,
      unreadCount,
    };
  }
}

export const getUserNotificationsUseCase = new GetUserNotificationsUseCase();
