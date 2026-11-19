'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MessageSquare, 
  Send, 
  ExternalLink, 
  ArrowLeft,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/formatters';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { EmptyState, ErrorState } from '@/components/ui/state-views';
import { chatService, ConversationSummary, ChatMessage } from '@/features/chat/chatService';

export default function ChatsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.user);

  const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [mobileView, setMobileView] = React.useState<'list' | 'thread'>('list');
  const [messageInput, setMessageInput] = React.useState('');
  const [isLoadingConversations, setIsLoadingConversations] = React.useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Manual refresh / retry handler
  const handleRefresh = React.useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingConversations(true);
    setError(null);
    try {
      const res = await chatService.getConversations(1, 30);
      setConversations(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedChatId((prev) => prev || res.data[0].id);
      }
    } catch (err: unknown) {
      console.warn('Could not load conversations from server:', err);
      setError('Could not connect to conversation service. Please try again.');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated]);

  // Initial load effect
  React.useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;

    chatService.getConversations(1, 30)
      .then((res) => {
        if (!ignore) {
          setConversations(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedChatId((prev) => prev || res.data[0].id);
          }
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('Could not load conversations from server:', err);
          setError('Could not connect to conversation service. Please try again.');
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  // Load messages when selectedChatId changes
  React.useEffect(() => {
    if (!selectedChatId) return;
    let ignore = false;

    chatService.getMessages(selectedChatId, undefined, 50)
      .then((res) => {
        if (!ignore) {
          setMessages(res.data || []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.warn('Could not load messages:', err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingMessages(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedChatId]);

  const activeConversation = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  // Other participant resolution
  const otherParticipant = React.useMemo(() => {
    if (!activeConversation?.participants) return null;
    return (
      activeConversation.participants.find((p) => p.userId !== currentUser?.id) ||
      activeConversation.participants[0]
    );
  }, [activeConversation, currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChatId || isSending) return;

    const text = messageInput.trim();
    setIsSending(true);

    try {
      const res = await chatService.sendMessage(selectedChatId, text);
      setMessages((prev) => [...prev, res.data]);
      setMessageInput('');
      // Update snippet in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedChatId
            ? { ...c, lastMessageText: text, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    setIsLoadingMessages(true);
    setMobileView('thread');
  };

  return (
    <PageContainer size="wide" className="space-y-4 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
              Buyer–Seller Chats
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Direct buyer-seller messaging with verified marketplace members across India.
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => handleRefresh()}
            disabled={isLoadingConversations}
            aria-label="Refresh chats"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingConversations ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <EmptyState
          title="Sign in to view your chats"
          description="Access your buyer-seller conversations, inquire about listings, and negotiate directly."
          actionLabel="Sign In with Email"
          actionHref="/login?redirect=/chats"
          icon={MessageSquare}
        />
      ) : error && conversations.length === 0 ? (
        <ErrorState
          title="Unable to load conversations"
          description={error}
          onRetry={handleRefresh}
        />
      ) : conversations.length === 0 && !isLoadingConversations ? (
        <EmptyState
          title="No conversations yet"
          description="When you contact a seller or a buyer reaches out about your listing, your chats will appear here."
          actionLabel="Explore Marketplace Listings"
          actionHref="/search"
          icon={MessageSquare}
        />
      ) : (
        /* Split Chat Layout (Responsive: Stack on Mobile with View Switching, Side-by-side on Desktop) */
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs min-h-[520px]">
          {/* Left Column: Conversations List */}
          <div
            className={`md:col-span-5 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${
              mobileView === 'thread' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Conversations ({conversations.length})
              </h2>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-y-auto flex-1">
              {conversations.map((conv) => {
                const partner = conv.participants?.find((p) => p.userId !== currentUser?.id) || conv.participants?.[0];
                const partnerName = partner?.user?.name || 'Seller';
                const avatar = partner?.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                const unread = partner?.unreadCount || 0;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      conv.id === selectedChatId
                        ? 'bg-orange-50/60 dark:bg-orange-950/20 border-l-4 border-l-orange-600'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={avatar}
                        alt={partnerName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {partnerName}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {conv.listing && (
                        <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 truncate">
                          {formatINR(conv.listing.price)} • {conv.listing.title}
                        </p>
                      )}

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {conv.lastMessageText || 'No messages yet'}
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Thread View */}
          <div
            className={`md:col-span-7 flex flex-col justify-between bg-zinc-50/30 dark:bg-zinc-950/20 ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversation ? (
              <>
                {/* Thread Header with Back button on Mobile */}
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      aria-label="Back to conversations list"
                      className="md:hidden p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={otherParticipant?.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={otherParticipant?.user?.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {otherParticipant?.user?.name || 'Marketplace Member'}
                        </span>
                        {otherParticipant?.user?.isVerifiedSeller && (
                          <Badge variant="brand" className="py-0 px-1 text-[9px] bg-emerald-600 text-white border-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      {activeConversation.listing && (
                        <p className="text-[11px] text-zinc-500 truncate">
                          {activeConversation.listing.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {activeConversation.listing && (
                    <Link
                      href={`/listing/${activeConversation.listing.id}`}
                      className="text-xs font-semibold text-orange-600 hover:underline shrink-0 flex items-center gap-1"
                    >
                      <span>View Ad</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Messages Container */}
                <div className="p-4 space-y-3 overflow-y-auto flex-1 max-h-[420px]">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center py-12 text-zinc-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-zinc-400">
                      No messages yet in this conversation. Say hello!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId === currentUser?.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                              isMe
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-bl-none'
                            }`}
                          >
                            {m.content}
                          </div>
                          <span className="text-[10px] text-zinc-400 mt-1 px-1">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={isSending}
                    aria-label="Type message"
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                    aria-label="Send message"
                    className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white transition-all active:scale-95 shrink-0"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-400 text-sm">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
