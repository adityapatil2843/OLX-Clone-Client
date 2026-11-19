import { apiClient } from '@/lib/api-client';

export type NotificationType =
  | 'NEW_MESSAGE'
  | 'LISTING_APPROVED'
  | 'LISTING_REJECTED'
  | 'LISTING_SOLD'
  | 'REEL_LIKED'
  | 'REEL_COMMENTED'
  | 'REPORT_RESOLVED';

export interface BackendNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface ListNotificationsQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface NotificationsApiResponse {
  success: boolean;
  data: BackendNotification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    unreadCount: number;
    totalPages: number;
  };
}

export const notificationsService = {
  getNotifications: async (
    query?: ListNotificationsQuery
  ): Promise<{ data: BackendNotification[]; meta: NotificationsApiResponse['meta'] }> => {
    const params: Record<string, unknown> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.isRead !== undefined) params.isRead = query.isRead;

    const res = await apiClient.get<NotificationsApiResponse>('/notifications', params);
    return { data: res.data || [], meta: res.meta };
  },

  markAsRead: async (notificationId: string): Promise<BackendNotification> => {
    const res = await apiClient.patch<{ success: boolean; data: BackendNotification }>(
      `/notifications/${encodeURIComponent(notificationId)}/read`
    );
    return res.data;
  },

  markAllAsRead: async (): Promise<{ updated: number }> => {
    const res = await apiClient.patch<{ success: boolean; data: { updated: number } }>(
      '/notifications/read-all'
    );
    return res.data;
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`/notifications/${encodeURIComponent(notificationId)}`);
  },
};
