'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, ShieldCheck, Film, ImageOff, Zap } from 'lucide-react';
import { ListingItem } from '../../types/listing';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { formatINR, formatRelativeDate } from '../../lib/formatters';

export { formatINR, formatRelativeDate };

export interface ListingCardProps {
  listing: ListingItem;
  className?: string;
  priority?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  className,
  priority = false,
}) => {
  const [isWishlisted, setIsWishlisted] = React.useState(Boolean(listing.isWishlisted));
  const [imageError, setImageError] = React.useState(false);

  const primaryMedia = listing.media?.[0];
  const imageUrl = primaryMedia?.url || primaryMedia?.thumbnailUrl;
  const hasVideo = listing.media?.some((m) => m.type === 'video');

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200',
        className
      )}
    >
      {/* Media Image Container */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
            <ImageOff className="w-8 h-8 stroke-1 mb-1" />
            <span className="text-[11px] font-medium">No photo</span>
          </div>
        )}

        {/* Sponsored / Boosted Pill */}
        {listing.isSponsored && (
          <div
            role="status"
            aria-label="Sponsored listing"
            className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-zinc-950 font-black text-[10px] tracking-wider uppercase shadow-xs"
          >
            <Zap className="w-3 h-3 fill-zinc-950" />
            <span>Featured</span>
          </div>
        )}

        {/* Video Reel Available Pill */}
        {hasVideo && (
          <div
            className={cn(
              'absolute z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide',
              listing.isSponsored ? 'top-8 left-2' : 'top-2 left-2'
            )}
          >
            <Film className="w-3 h-3 text-rose-400" />
            <span>REEL</span>
          </div>
        )}

        {/* Seller Verification Pill */}
        {listing.seller?.isVerified && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant="brand" className="bg-emerald-600/90 text-white border-0 shadow-xs py-0.5 px-1.5 text-[10px] normal-case tracking-normal">
              <ShieldCheck className="w-3 h-3 mr-0.5 inline" />
              Verified
            </Badge>
          </div>
        )}

        {/* Favourite / Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from favourites' : 'Save to favourites'}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white text-zinc-700 dark:text-zinc-200 shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              isWishlisted
                ? 'fill-rose-500 text-rose-500'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'
            )}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5 space-y-1.5">
        {/* Price & Negotiation Tag */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            {formatINR(listing.price)}
          </span>
          {listing.isNegotiable && (
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Negotiable
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {listing.title}
        </h3>

        {/* Location & Time Footer */}
        <div className="mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1 truncate mr-2">
            <MapPin className="w-3 h-3 shrink-0 text-zinc-400" />
            <span className="truncate">
              {[listing.location.locality, listing.location.city].filter(Boolean).join(', ') || 'India'}
            </span>
          </div>
          <span className="shrink-0 text-[10px]">
            {formatRelativeDate(listing.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};
