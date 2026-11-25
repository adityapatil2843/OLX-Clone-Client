'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Pause,
  Check,
  ExternalLink,
  Zap,
  Volume2,
  VolumeX,
  Music2,
} from 'lucide-react';
import { ReelItem } from '../../types/reel';
import { formatINR, formatCompactNumber } from '../../lib/formatters';
import { cn } from '../../lib/utils';
import { getReelCanonicalUrl, shareContent } from '../../lib/share';
import { ReelCommentsSheet } from './ReelCommentsSheet';
import { ReelActionRail } from './ReelActionRail';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { reelsService } from '@/features/reels/reelsService';
import { useReelPlaybackStore } from '@/features/reels/useReelPlaybackStore';
import { AuthPromptModal } from '@/components/ui/state-views';

export { formatCompactNumber };

export interface ReelCardProps {
  reel: ReelItem;
  className?: string;
  isFeedMode?: boolean;
  priority?: boolean;
  isActive?: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  className,
  isFeedMode = false,
  priority = false,
  isActive = false,
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = React.useState(Boolean(reel.isLiked));
  const [likesCount, setLikesCount] = React.useState(reel.metrics.likes);
  const [isSaved, setIsSaved] = React.useState(Boolean(reel.isSaved));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
  const [commentsCount, setCommentsCount] = React.useState(reel.metrics.comments || 0);
  const [authModalConfig, setAuthModalConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
  } | null>(null);

  const cardInstanceId = React.useId();
  const activePlayerId = useReelPlaybackStore((s) => s.activePlayerId);
  const setActivePlayer = useReelPlaybackStore((s) => s.setActivePlayer);
  const isStoreActive = activePlayerId === cardInstanceId;

  const isManuallyPausedRef = React.useRef(false);

  // Explicit unmount cleanup to prevent background playback on route changes
  React.useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
      }
      if (useReelPlaybackStore.getState().activePlayerId === cardInstanceId) {
        useReelPlaybackStore.getState().setActivePlayer(null);
      }
    };
  }, [cardInstanceId]);

  // Pause whenever another ReelCard becomes active in the coordinator
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isStoreActive && !video.paused) {
      video.pause();
    }
  }, [isStoreActive]);

  // Sync playback with isActive in feed mode
  React.useEffect(() => {
    if (!isFeedMode) return;
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      isManuallyPausedRef.current = false;
      setActivePlayer(cardInstanceId);
      video.play().catch(() => {});
    } else {
      video.pause();
      if (useReelPlaybackStore.getState().activePlayerId === cardInstanceId) {
        setActivePlayer(null);
      }
    }
  }, [isFeedMode, isActive, cardInstanceId, setActivePlayer]);

  // Page Visibility API: pause when tab is hidden, resume when tab is active again
  React.useEffect(() => {
    if (!isStoreActive) return;

    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else if (!isManuallyPausedRef.current) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isStoreActive]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      isManuallyPausedRef.current = false;
      setActivePlayer(cardInstanceId);
      video.play().catch(() => {});
    } else {
      isManuallyPausedRef.current = true;
      if (useReelPlaybackStore.getState().activePlayerId === cardInstanceId) {
        setActivePlayer(null);
      }
      video.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

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
      ref={containerRef}
      className={cn(
        'group relative flex w-full items-end justify-center select-none',
        className
      )}
    >
      {/* ── DESKTOP LEFT: Profile & Product Information ── */}
      <div className="hidden md:flex flex-col justify-end w-64 lg:w-72 pr-6 pb-4 space-y-3 z-20 shrink-0">
        {/* Creator Row */}
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${reel.creator.id}`}
            className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0 hover:opacity-90 transition-opacity"
          >
            {reel.creator.avatarUrl ? (
              <Image
                src={reel.creator.avatarUrl}
                alt={reel.creator.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white">
                {reel.creator.name[0]}
              </div>
            )}
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/profile/${reel.creator.id}`}
              className="font-bold text-sm text-white hover:underline truncate"
            >
              {reel.creator.name}
            </Link>
            {reel.creator.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
              </span>
            )}
            <button
              type="button"
              className="text-xs font-semibold text-white/90 hover:text-white px-2.5 py-1 rounded-lg border border-white/30 hover:border-white/60 transition-colors shrink-0 ml-1"
            >
              Follow
            </button>
          </div>
        </div>

        {/* Audio Information */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Music2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Original audio • {reel.creator.name}</span>
        </div>

        {/* Caption / Title */}
        <p className="text-sm font-normal text-zinc-100 line-clamp-3 leading-snug">
          {reel.title}
        </p>

        {/* Linked Listing Pill Button */}
        {reel.listingId && reel.price && (
          <Link
            href={`/listing/${reel.listingId}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 text-zinc-950 hover:bg-white text-xs font-bold shadow-lg transition-all active:scale-95"
          >
            <span>{formatINR(reel.price)}</span>
            <span className="text-zinc-400">•</span>
            <span className="truncate max-w-[130px]">View Product</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
          </Link>
        )}
      </div>

      {/* ── CENTER: Vertical Video Rectangle (9:16) ── */}
      <div
        className={cn(
          'relative aspect-9/16 rounded-2xl overflow-hidden bg-black text-white shadow-2xl border border-zinc-800 transition-transform duration-200 shrink-0',
          isFeedMode
            ? 'w-full max-w-sm sm:max-w-[380px] h-[calc(100vh-140px)] md:h-[calc(100vh-4rem)] max-h-[720px]'
            : 'w-full max-w-sm hover:-translate-y-1'
        )}
      >
        {/* Background Video Element or Poster Image */}
        {reel.videoUrl ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={poster}
            playsInline
            loop
            muted={isMuted}
            preload={priority ? 'auto' : 'metadata'}
            onPlay={() => {
              setIsPlaying(true);
              if (useReelPlaybackStore.getState().activePlayerId !== cardInstanceId) {
                setActivePlayer(cardInstanceId);
              }
            }}
            onPause={() => setIsPlaying(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : poster ? (
          <Image
            src={poster}
            alt={reel.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-500"
          />
        ) : null}

        {/* Dimmed Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/50 pointer-events-none" />

        {/* Top Badges (Duration, Sponsored) */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
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
            className="pointer-events-auto px-2.5 py-0.5 rounded-full bg-orange-600/90 hover:bg-orange-600 text-[10px] font-bold tracking-wide uppercase transition-colors"
          >
            Watch Reel
          </Link>
        </div>

        {/* Center: Play/Pause Control Button */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all pointer-events-none shadow-lg',
              isPlaying ? 'opacity-0 scale-95' : 'opacity-90 scale-100 hover:scale-110'
            )}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </div>
        </div>

        {/* Video Bottom-Right: Mute/Unmute Control */}
        {reel.videoUrl && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="absolute bottom-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 pointer-events-auto shadow-md"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        {/* Mobile Info Overlay (Shown only on small screens < 768px) */}
        <div className="md:hidden absolute bottom-3 left-3 right-16 z-20 space-y-2 pointer-events-auto">
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

          <p className="text-xs font-medium text-zinc-100 line-clamp-2 leading-snug">
            {reel.title}
          </p>

          {reel.listingId && reel.price && (
            <Link
              href={`/listing/${reel.listingId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-zinc-950 hover:bg-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <span>{formatINR(reel.price)}</span>
              <span className="text-zinc-400">•</span>
              <span className="truncate max-w-[110px]">View Product</span>
              <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0" />
            </Link>
          )}
        </div>

        {/* Mobile Action Rail Overlay (Inside right edge on < 768px) */}
        <div className="md:hidden absolute right-2.5 bottom-16 z-20">
          <ReelActionRail
            reel={reel}
            isLiked={isLiked}
            likesCount={likesCount}
            onLike={handleLike}
            commentsCount={commentsCount}
            onOpenComments={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCommentsOpen(true);
            }}
            isSaved={isSaved}
            onSave={handleSave}
            onShare={handleShare}
            isMobileOverlay={true}
          />
        </div>
      </div>

      {/* ── DESKTOP RIGHT: External Action Rail (>= 768px) ── */}
      <div className="hidden md:flex flex-col justify-end pl-5 pb-4 shrink-0">
        <ReelActionRail
          reel={reel}
          isLiked={isLiked}
          likesCount={likesCount}
          onLike={handleLike}
          commentsCount={commentsCount}
          onOpenComments={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCommentsOpen(true);
          }}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
          isMobileOverlay={false}
        />
      </div>

      {/* Share Toast Notification */}
      {shareFeedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold shadow-lg animate-fade-in">
          {shareFeedback}
        </div>
      )}

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
