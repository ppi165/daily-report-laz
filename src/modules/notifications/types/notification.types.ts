export type NotificationType =
  | "APPRECIATION"
  | "PEER_REPORT"
  | "APPROVAL_REQUEST"
  | "APPROVAL_RESULT"
  | "REMINDER"
  | "COMMENT_MENTION";

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  reportId?: string | null;
  actorId?: string | null;
  actor?: {
    id: string;
    name: string;
    avatar?: string | null;
    division?: string | null;
  } | null;
  isRead: boolean;
  readAt?: string | null;
  metadata?: {
    likerIds?: string[];
    totalLiker?: number;
    lastActorName?: string;
    secondActorName?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
