'use client';

import * as React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/formatters';
import { ReelItem } from '@/types/reel';

export interface ReelActionRailProps {
  reel: ReelItem;
  isLiked: boolean;
  likesCount: number;
  onLike: (e: React.MouseEvent) => void;
  commentsCount: number;
  onOpenComments: (e: React.MouseEvent) => void;
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  className?: string;
  isMobileOverlay?: boolean;
}

export const ReelActionRail: React.FC<ReelActionRailProps> = ({
  reel,
  isLiked,
  likesCount,
  onLike,
  commentsCount,
  onOpenComments,
  isSaved,
  onSave,
  onShare,
  className,
  isMobileOverlay = false,
}) => {
  return (
    <div
      className={cn(
        'relative z-30 flex flex-col items-center gap-4 pointer-events-auto select-none',
        className
      )}
    >
      {/* Like */}
      <button
        type="button"
        onClick={onLike}
        aria-label={isLiked ? 'Unlike reel' : 'Like reel'}
        className="group flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform focus:outline-none"
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isMobileOverlay
              ? 'bg-black/40 backdrop-blur-xs hover:bg-black/60'
              : 'hover:bg-zinc-800 text-white'
          )}
        >
          <Heart
            className={cn(
              'w-6 h-6 transition-transform group-hover:scale-110',
              isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
            )}
          />
        </div>
        <span className="text-[11px] font-bold mt-0.5 tracking-tight">
          {formatCompactNumber(likesCount)}
        </span>
      </button>

      {/* Comments */}
      <button
        type="button"
        onClick={onOpenComments}
        aria-label={`View comments (${commentsCount})`}
        className="group flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform focus:outline-none"
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isMobileOverlay
              ? 'bg-black/40 backdrop-blur-xs hover:bg-black/60'
              : 'hover:bg-zinc-800 text-white'
          )}
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-[11px] font-bold mt-0.5 tracking-tight">
          {formatCompactNumber(commentsCount)}
        </span>
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={onShare}
        aria-label="Share reel"
        className="group flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform focus:outline-none"
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isMobileOverlay
              ? 'bg-black/40 backdrop-blur-xs hover:bg-black/60'
              : 'hover:bg-zinc-800 text-white'
          )}
        >
          <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-[11px] font-bold mt-0.5 tracking-tight">
          {reel.metrics.shares ? formatCompactNumber(reel.metrics.shares) : 'Share'}
        </span>
      </button>

      {/* Save / Bookmark */}
      <button
        type="button"
        onClick={onSave}
        aria-label={isSaved ? 'Remove from saved' : 'Save reel'}
        className="group flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform focus:outline-none"
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isMobileOverlay
              ? 'bg-black/40 backdrop-blur-xs hover:bg-black/60'
              : 'hover:bg-zinc-800 text-white'
          )}
        >
          <Bookmark
            className={cn(
              'w-6 h-6 transition-transform group-hover:scale-110',
              isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'
            )}
          />
        </div>
        <span className="text-[11px] font-bold mt-0.5 tracking-tight">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </button>

      {/* More Options */}
      <button
        type="button"
        onClick={onShare}
        aria-label="More reel options"
        className="group flex flex-col items-center min-w-[44px] min-h-[44px] justify-center text-white active:scale-90 transition-transform focus:outline-none"
      >
        <div
          className={cn(
            'p-3 rounded-full transition-colors',
            isMobileOverlay
              ? 'bg-black/40 backdrop-blur-xs hover:bg-black/60'
              : 'hover:bg-zinc-800 text-white'
          )}
        >
          <MoreHorizontal className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {/* Creator/Audio mini square avatar (IG-style) */}
      <div className="mt-2 relative w-7 h-7 rounded-lg overflow-hidden border-2 border-white/60 shrink-0 shadow-sm animate-pulse">
        {reel.creator.avatarUrl ? (
          <Image
            src={reel.creator.avatarUrl}
            alt={reel.creator.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
            {reel.creator.name[0]}
          </div>
        )}
      </div>
    </div>
  );
};
