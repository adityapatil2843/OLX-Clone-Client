import { apiClient } from '@/lib/api-client';

export interface ChatParticipant {
  id: string;
  userId: string;
  unreadCount?: number;
  lastReadAt?: string | null;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isVerifiedSeller?: boolean;
  };
}

export interface ChatListingContext {
  id: string;
  title: string;
  price: number;
  currency?: string;
  media?: Array<{
    id: string;
    type: string;
    storageKey: string;
    url?: string;
  }>;
}

export interface ConversationSummary {
  id: string;
  listingId?: string | null;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  participants: ChatParticipant[];
  listing?: ChatListingContext | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  type: 'TEXT' | 'IMAGE' | 'LISTING_SHARE';
  content: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface ListConversationsResponse {
  data: ConversationSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface ListMessagesResponse {
  data: ChatMessage[];
  meta: {
    cursor?: string | null;
    nextCursor?: string | null;
    hasMore: boolean;
    limit: number;
  };
}

export const chatService = {
  /**
   * Retrieves paginated conversations for current authenticated user
   */
  async getConversations(page = 1, limit = 20): Promise<ListConversationsResponse> {
    return apiClient.get<ListConversationsResponse>('/conversations', { page, limit });
  },

  /**
   * Retrieves single conversation details
   */
  async getConversation(conversationId: string): Promise<{ data: ConversationSummary }> {
    return apiClient.get<{ data: ConversationSummary }>(`/conversations/${conversationId}`);
  },

  /**
   * Retrieves paginated message history for a conversation
   */
  async getMessages(conversationId: string, cursor?: string, limit = 30): Promise<ListMessagesResponse> {
    const params: Record<string, unknown> = { limit };
    if (cursor) params.cursor = cursor;
    return apiClient.get<ListMessagesResponse>(`/conversations/${conversationId}/messages`, params);
  },

  /**
   * Sends a message in an existing conversation
   */
  async sendMessage(
    conversationId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'LISTING_SHARE' = 'TEXT'
  ): Promise<{ data: ChatMessage }> {
    return apiClient.post<{ data: ChatMessage }>(`/conversations/${conversationId}/messages`, {
      content,
      type,
    });
  },

  /**
   * Creates or retrieves conversation with recipient for a listing
   */
  async getOrCreateConversation(
    recipientId: string,
    listingId?: string
  ): Promise<{ data: ConversationSummary }> {
    return apiClient.post<{ data: ConversationSummary }>('/conversations', {
      recipientId,
      listingId,
    });
  },
};
