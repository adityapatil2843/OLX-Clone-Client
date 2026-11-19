import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatService } from '../../src/features/chat/chatService';
import { apiClient } from '../../src/lib/api-client';

describe('Chat Service & API Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls GET /conversations with bounded page and limit params', async () => {
    const mockResponse = {
      data: [
        {
          id: 'conv-1',
          listingId: 'listing-1',
          lastMessageText: 'Is this available?',
          lastMessageAt: '2026-11-18T10:00:00Z',
          createdAt: '2026-11-18T09:00:00Z',
          updatedAt: '2026-11-18T10:00:00Z',
          participants: [
            { id: 'part-1', userId: 'user-1' },
            { id: 'part-2', userId: 'seller-1', user: { id: 'seller-1', name: 'Seller One' } },
          ],
        },
      ],
      meta: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
      },
    };

    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue(mockResponse);

    const result = await chatService.getConversations(1, 20);

    expect(getSpy).toHaveBeenCalledWith('/conversations', { page: 1, limit: 20 });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('conv-1');
  });

  it('calls POST /conversations/:id/messages to send a new message', async () => {
    const mockMessage = {
      data: {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hello, what is your best price?',
        type: 'TEXT' as const,
        isRead: false,
        createdAt: '2026-11-18T10:05:00Z',
      },
    };

    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue(mockMessage);

    const result = await chatService.sendMessage('conv-1', 'Hello, what is your best price?');

    expect(postSpy).toHaveBeenCalledWith('/conversations/conv-1/messages', {
      content: 'Hello, what is your best price?',
      type: 'TEXT',
    });
    expect(result.data.content).toBe('Hello, what is your best price?');
  });
});
