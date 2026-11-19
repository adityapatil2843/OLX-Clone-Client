'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, Heart, Bookmark, Share2, Check, ExternalLink, MessageCircle, Zap } from 'lucide-react';
import { ReelItem } from '../../types/reel';
import { formatINR, formatCompactNumber } from '../../lib/formatters';
import { cn } from '../../lib/utils';
import { getReelCanonicalUrl, shareContent } from '../../lib/share';
import { ReelCommentsSheet } from './ReelCommentsSheet';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { reelsService } from '@/features/reels/reelsService';
import { AuthPromptModal } from '@/components/ui/state-views';

export { formatCompactNumber };

export interface ReelCardProps {
  reel: ReelItem;
  className?: string;
  isFeedMode?: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, className, isFeedMode = false }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isLiked, setIsLiked] = React.useState(Boolean(reel.isLiked));
  const [likesCount, setLikesCount] = React.useState(reel.metrics.likes);
  const [isSaved, setIsSaved] = React.useState(Boolean(reel.isSaved));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
  const [commentsCount, setCommentsCount] = React.useState(reel.metrics.comments || 0);
  const [authModalConfig, setAuthModalConfig] = React.useState<{ isOpen: boolean; title: string; description: string } | null>(null);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthModalConfig({
        isOpen: true,
        title: 'Sign In to Like',
        description: 'Sign in to save and like product video reels on Bazarr 360.',
      });
      return;
    }

    const previousLiked = isLiked;
    const previousLikesCount = likesCount;
    const nextLiked = !previousLiked;
    setIsLiked(nextLiked);
    setLikesCount(nextLiked ? previousLikesCount + 1 : Math.max(0, previousLikesCount - 1));

    try {
      if (nextLiked) {
        await reelsService.likeReel(reel.id);
      } else {
        await reelsService.unlikeReel(reel.id);
      }
    } catch {
      setIsLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setAuthModalConfig({
        isOpen: true,
        title: 'Sign In to Save',
        description: 'Sign in to bookmark product reels to your personal collection.',
      });
      return;
    }

    const previousSaved = isSaved;
    const nextSaved = !previousSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await reelsService.saveReel(reel.id);
      } else {
        await reelsService.unsaveReel(reel.id);
      }
    } catch {
      setIsSaved(previousSaved);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getReelCanonicalUrl(reel.id);
    const result = await shareContent({
      title: `${reel.title} - Bazarr 360 Reel`,
      text: `Watch this product reel by ${reel.creator.name} on Bazarr 360`,
      url: shareUrl,
    });

    if (result.copied) {
      setShareFeedback('Link copied!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  const poster = reel.customThumbnailUrl || reel.thumbnailUrl;

  return (
    <div
      className={cn(
        'group relative flex flex-col aspect-9/16 rounded-2xl overflow-hidden bg-black text-white shadow-md border border-zinc-800 transition-transform duration-200 select-none',
        isFeedMode ? 'w-full max-w-sm mx-auto h-[calc(100vh-140px)] max-h-[700px]' : 'hover:-translate-y-1',
        className
      )}
    >
      {/* Background Poster / Media View */}
      {poster && (
        <Image
          src={poster}
          alt={reel.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-102 transition-transform duration-500"
        />
      )}

      {/* Dimmed Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />

      {/* Top Bar: Duration & Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono font-medium">
            {`${reel.durationSeconds}s`}
          </span>
          {reel.isSponsored && (
            <span
              role="status"
              aria-label="Sponsored reel"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow-xs"
            >
              <Zap className="w-2.5 h-2.5 fill-zinc-950" />
              <span>Sponsored</span>
            </span>
          )}
        </div>
        <Link
          href={`/reels/${reel.id}`}
          className="px-2.5 py-0.5 rounded-full bg-orange-600/90 hover:bg-orange-600 text-[10px] font-bold tracking-wide uppercase transition-colors"
        >
          Watch Reel
        </Link>
      </div>

      {/* Play/Pause Simulation Button */}
      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause video preview' : 'Play video preview'}
        className="absolute inset-0 flex items-center justify-center z-10 focus:outline-none"
      >
        <div
          className={cn(
            'w-14 h-14 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white transition-all',
            isPlaying ? 'opacity-0 hover:opacity-100 scale-95' : 'opacity-85 hover:scale-110'
          )}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white ml-1" />
          )}
        </div>
      </button>

      {/* Share Toast Notification */}
      {shareFeedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold shadow-lg animate-fade-in">
          {shareFeedback}
        </div>
      )}

      {/* Right Column Action Buttons */}
      <div className="absolute right-2.5 bottom-24 z-20 flex flex-col items-center gap-2">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          aria-label="Like reel"
          className="flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition-colors">
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
              )}
            />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">{formatCompactNumber(likesCount)}</span>
        </button>

        {/* Comments Count & Sheet Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCommentsOpen(true);
          }}
          aria-label={`View comments (${commentsCount})`}
          className="flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition-colors">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">
            {formatCompactNumber(commentsCount)}
          </span>
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          aria-label="Save reel"
          className="flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition-colors">
            <Bookmark
              className={cn(
                'w-5 h-5 transition-colors',
                isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'
              )}
            />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share reel"
          className="flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-xs hover:bg-black/60 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Share</span>
        </button>
      </div>

      {/* Bottom Information Overlay */}
      <div className="absolute bottom-3 left-3 right-14 z-20 space-y-2 pointer-events-auto">
        {/* Creator Row */}
        <Link
          href={`/profile/${reel.creator.id}`}
          className="inline-flex items-center gap-2 group/creator"
        >
          {reel.creator.avatarUrl ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/50 shrink-0">
              <Image
                src={reel.creator.avatarUrl}
                alt={reel.creator.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
              {reel.creator.name[0]}
            </div>
          )}
          <span className="text-xs font-bold truncate group-hover/creator:underline">
            {reel.creator.name}
          </span>
          {reel.creator.isVerified && (
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
            </span>
          )}
        </Link>

        {/* Title */}
        <p className="text-xs font-medium text-zinc-100 line-clamp-2 leading-snug">
          {reel.title}
        </p>

        {/* Linked Listing Pill Button */}
        {reel.listingId && reel.price && (
          <Link
            href={`/listing/${reel.listingId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-zinc-950 hover:bg-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>{formatINR(reel.price)}</span>
            <span className="text-zinc-400">•</span>
            <span className="truncate max-w-[120px]">View Product</span>
            <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0" />
          </Link>
        )}
      </div>

      {/* Reel Comments Bottom Sheet */}
      <ReelCommentsSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reelId={reel.id}
        initialCommentsCount={commentsCount}
        onCommentAdded={() => setCommentsCount((c) => c + 1)}
      />

      {/* Guest Authentication Prompt Modal */}
      {authModalConfig && (
        <AuthPromptModal
          isOpen={authModalConfig.isOpen}
          onClose={() => setAuthModalConfig(null)}
          title={authModalConfig.title}
          description={authModalConfig.description}
          returnUrl={`/reels/${reel.id}`}
        />
      )}
    </div>
  );
};
