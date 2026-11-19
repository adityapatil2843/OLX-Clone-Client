'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Bell, 
  MessageSquare, 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { notificationsService, BackendNotification } from '@/features/notifications/notificationsService';
import { formatRelativeDate } from '@/lib/formatters';
import { ErrorState, EmptyState, getFriendlyErrorMessage } from '@/components/ui/state-views';

export default function NotificationsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [notifications, setNotifications] = React.useState<BackendNotification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isLoading = isAuthLoading || (isAuthenticated && isDataLoading);

  const fetchNotifications = React.useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsDataLoading(true);
    setErrorMessage(null);
    try {
      const res = await notificationsService.getNotifications({ page: 1, limit: 30 });
      setNotifications(res.data || []);
      setUnreadCount(res.meta?.unreadCount || 0);
    } catch (err) {
      const friendly = getFriendlyErrorMessage(err);
      setErrorMessage(friendly.description);
    } finally {
      setIsDataLoading(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let ignore = false;
    notificationsService.getNotifications({ page: 1, limit: 30 })
      .then((res) => {
        if (!ignore) {
          setNotifications(res.data || []);
          setUnreadCount(res.meta?.unreadCount || 0);
          setIsDataLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const friendly = getFriendlyErrorMessage(err);
          setErrorMessage(friendly.description);
          setIsDataLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Fallback optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Fallback optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationsService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const renderIcon = (type: BackendNotification['type']) => {
    switch (type) {
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'REEL_LIKED':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'REEL_COMMENTED':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'LISTING_APPROVED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'LISTING_REJECTED':
      case 'LISTING_SOLD':
        return <AlertCircle className="w-4 h-4 text-zinc-500" />;
      default:
        return <Bell className="w-4 h-4 text-orange-600" />;
    }
  };

  if (!isAuthenticated && !isAuthLoading) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <EmptyState
          title="Sign in to view notifications"
          description="Access in-app updates for chats, marketplace inquiries, reel likes, and listing activity."
          actionHref="/login?redirect=/notifications"
          actionLabel="Sign In / Register"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="narrow" className="space-y-4 sm:space-y-6 pb-24 md:pb-12">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Link href="/" className="md:hidden text-zinc-600 p-1 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="relative">
            <Bell className="w-5 h-5 text-orange-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-600 border-2 border-white dark:border-zinc-950" />
            )}
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Notifications {unreadCount > 0 && <span className="text-orange-600 text-sm">({unreadCount} new)</span>}
          </h1>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-36 h-3.5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-3/4 h-3 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <div className="py-12">
          <ErrorState
            title="Could not load notifications"
            description={errorMessage}
            onRetry={fetchNotifications}
          />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 mx-auto flex items-center justify-center">
            <Bell className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No notifications yet
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            You will receive updates here when buyers message your ads, comment on your reels, or when your listings are verified.
          </p>
          <div className="pt-2">
            <Link
              href="/search"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && handleMarkAsRead(item.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                item.isRead
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200/80 dark:border-orange-900/50 shadow-2xs'
              }`}
            >
              {/* Icon Bubble */}
              <div className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-2xs">
                {renderIcon(item.type)}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-zinc-400 shrink-0 font-medium">
                    {formatRelativeDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 leading-snug">
                  {item.message}
                </p>
              </div>

              {/* Delete / Actions */}
              <div className="flex items-center gap-1 shrink-0 self-center">
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                )}
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  aria-label="Delete notification"
                  className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
