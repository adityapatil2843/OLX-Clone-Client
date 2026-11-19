'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, Send, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ReelComment, reelsService } from '@/features/reels/reelsService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { AuthPromptModal, getFriendlyErrorMessage } from '@/components/ui/state-views';
import { formatRelativeDate } from '@/lib/formatters';

export interface ReelCommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  initialCommentsCount?: number;
  onCommentAdded?: (newComment: ReelComment) => void;
}

const ReelCommentsSheetContent: React.FC<Omit<ReelCommentsSheetProps, 'isOpen'>> = ({
  onClose,
  reelId,
  initialCommentsCount = 0,
  onCommentAdded,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = React.useState<ReelComment[]>([]);
  const [totalCount, setTotalCount] = React.useState(initialCommentsCount);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [commentText, setCommentText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listEndRef = React.useRef<HTMLDivElement>(null);

  // Load comments via async promise to avoid synchronous setState inside effect
  React.useEffect(() => {
    let ignore = false;
    reelsService
      .getComments(reelId, { page: 1, limit: 50 })
      .then((res) => {
        if (!ignore) {
          setComments(res.data || []);
          if (typeof res.meta?.total === 'number') {
            setTotalCount(res.meta.total);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const friendly = getFriendlyErrorMessage(err);
          setErrorMessage(friendly.description);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reelId]);

  const reloadComments = () => {
    setIsLoading(true);
    setErrorMessage(null);
    reelsService
      .getComments(reelId, { page: 1, limit: 50 })
      .then((res) => {
        setComments(res.data || []);
        if (typeof res.meta?.total === 'number') {
          setTotalCount(res.meta.total);
        }
      })
      .catch((err) => {
        const friendly = getFriendlyErrorMessage(err);
        setErrorMessage(friendly.description);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (trimmed.length > 1000) {
      setSubmitError('Comment cannot exceed 1000 characters.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newComment = await reelsService.addComment(reelId, trimmed);
      setComments((prev) => [newComment, ...prev]);
      setTotalCount((c) => c + 1);
      setCommentText('');
      onCommentAdded?.(newComment);
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      const friendly = getFriendlyErrorMessage(err);
      setSubmitError(friendly.description);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputFocus = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container: Mobile Bottom Sheet / Desktop Centered Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reel Comments"
        className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[85vh] md:max-h-[650px] overflow-hidden animate-slide-up"
      >
        {/* Drag Handle on Mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Comments {totalCount > 0 && <span className="text-zinc-400 font-normal">{`(${totalCount})`}</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {isLoading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="w-24 h-3 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-3/4 h-3.5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="py-8 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">{errorMessage}</p>
              <button
                type="button"
                onClick={reloadComments}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold hover:bg-orange-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 mx-auto flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No comments yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Be the first to share your thoughts or ask a question about this product!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-xs">
                {/* User Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                  {comment.user?.avatarUrl ? (
                    <Image
                      src={comment.user.avatarUrl}
                      alt={comment.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{(comment.user?.name || 'U')[0].toUpperCase()}</span>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {comment.user?.name || 'Verified Buyer'}
                    </span>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {formatRelativeDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed break-words whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={listEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          {submitError && (
            <p className="text-[11px] text-rose-500 mb-2 font-medium px-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{submitError}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                if (submitError) setSubmitError(null);
              }}
              onFocus={handleInputFocus}
              placeholder={
                isAuthenticated
                  ? `Comment as ${user?.name || 'You'}...`
                  : 'Sign in to comment on this reel...'
              }
              maxLength={1000}
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              aria-label="Send comment"
              className="px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {commentText.length > 800 && (
            <p className="text-[10px] text-zinc-400 text-right mt-1 font-mono">
              {commentText.length}/1000
            </p>
          )}
        </div>
      </div>

      {/* Guest Authentication Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Comment"
        description="Join Bazarr 360 to comment on product reels, ask sellers questions, and negotiate directly."
        returnUrl={`/reels/${reelId}`}
      />
    </>
  );
};

export const ReelCommentsSheet: React.FC<ReelCommentsSheetProps> = (props) => {
  if (!props.isOpen) return null;
  return <ReelCommentsSheetContent {...props} />;
};
