'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  AlertTriangle, 
  Calendar, 
  Tag, 
  ChevronRight,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { formatINR, formatRelativeDate } from '@/lib/formatters';
import { ListingItem } from '@/types/listing';
import { ReelItem } from '@/types/reel';
import { ReelCard } from '@/components/reels/ReelCard';
import { getListingCanonicalUrl, shareContent } from '@/lib/share';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { wishlistService } from '@/features/marketplace/wishlistService';
import { AuthPromptModal } from '@/components/ui/state-views';
import { BoostModal } from '@/components/boost/BoostModal';

export interface ListingDetailViewProps {
  listing: ListingItem;
  relatedListings: ListingItem[];
  relatedReels?: ReelItem[];
  sellerListings?: ListingItem[];
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listing,
  relatedListings,
  relatedReels = [],
  sellerListings = [],
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.user);
  const isOwner = Boolean(currentUser?.id && currentUser.id === listing.seller.id);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isWishlisted, setIsWishlisted] = React.useState(Boolean(listing.isWishlisted));
  const [isUpdatingWishlist, setIsUpdatingWishlist] = React.useState(false);
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = React.useState(false);
  const [authPromptReason, setAuthPromptReason] = React.useState('');

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      setAuthPromptReason('Sign in to save this listing to your favourites.');
      setIsAuthModalOpen(true);
      return;
    }
    if (isUpdatingWishlist) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setIsUpdatingWishlist(true);

    try {
      if (previousState) {
        await wishlistService.removeFromWishlist(listing.id);
      } else {
        await wishlistService.addToWishlist(listing.id);
      }
    } catch {
      setIsWishlisted(previousState);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthPromptReason('Sign in to send direct messages to verified sellers.');
      setIsAuthModalOpen(true);
    }
  };

  const handleShare = async () => {
    const shareUrl = getListingCanonicalUrl(listing.id);
    const result = await shareContent({
      title: `${listing.title} for ${formatINR(listing.price)} on Bazarr 360`,
      text: `Check out ${listing.title} on Bazarr 360`,
      url: shareUrl,
    });

    if (result.copied) {
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  return (
    <div className="w-full pb-36 md:pb-12">
      <PageContainer className="space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation & Top Action Row */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-3 text-xs text-zinc-500 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5 md:hidden" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <Link href={`/categories/${listing.category}`} className="hover:text-orange-600 capitalize transition-colors">
              {listing.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-400 hidden sm:inline" />
            <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[180px] hidden sm:inline">
              {listing.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this listing"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={isWishlisted ? 'Remove listing from favourites' : 'Save listing to favourites'}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </nav>

        {/* Share Feedback Toast */}
        {shareFeedback && (
          <div role="status" className="rounded-xl bg-orange-600 text-white px-4 py-2 text-xs font-bold shadow-md text-center animate-fade-in">
            {shareFeedback}
          </div>
        )}

        {/* Main Listing Grid: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Left Column: Media Gallery, Attributes & Description (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Main Media Gallery */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black shadow-sm">
              <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden bg-zinc-950">
                {listing.media[activeImageIndex] && (
                  <Image
                    src={listing.media[activeImageIndex].url}
                    alt={listing.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-contain"
                  />
                )}
                {listing.seller.isVerified && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="brand" className="bg-emerald-600 text-white border-0 py-0.5 px-2 text-xs font-semibold shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                      Verified Seller
                    </Badge>
                  </div>
                )}

                {/* Mobile Gallery Counter Badge */}
                <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono">
                  {activeImageIndex + 1} / {listing.media.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {listing.media.length > 1 && (
                <div className="p-2.5 bg-zinc-950 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {listing.media.map((med, idx) => (
                    <button
                      key={med.id || idx}
                      type="button"
                      aria-label={`View photo ${idx + 1}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all focus-visible:ring-2 focus-visible:ring-orange-500 ${
                        activeImageIndex === idx ? 'border-orange-500 scale-102' : 'border-zinc-800 opacity-70'
                      }`}
                    >
                      <Image
                        src={med.thumbnailUrl || med.url}
                        alt={`Photo thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price, Title & Key Info Card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 space-y-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                    {formatINR(listing.price)}
                  </span>
                  {listing.isNegotiable && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                      Negotiable
                    </span>
                  )}
                </div>
                <h1 className="text-base sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    {[listing.location.locality, listing.location.city, listing.location.state].filter(Boolean).join(', ')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    {formatRelativeDate(listing.createdAt)}
                  </span>
                </div>
              </div>

              {/* Specifications Grid */}
              {listing.attributes && Object.keys(listing.attributes).length > 0 && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Key Specifications</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(listing.attributes).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
                      >
                        <span className="text-[10px] text-zinc-400 block uppercase font-medium">{key}</span>
                        <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 block mt-0.5 truncate">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Description
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Buyer Safety Tips */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bazarr 360 Safety Advice</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300/90 text-[11px] leading-relaxed">
                <li>Meet the seller in a safe, public place in your local city.</li>
                <li>Inspect the product physically and verify condition before transferring payment.</li>
                <li>Never send advance deposits or wire transfers before inspecting the item.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Seller Info & Actions on Desktop (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Seller Summary Box */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Seller Information
              </h2>

              <div className="flex items-center gap-3">
                {listing.seller.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                    <Image
                      src={listing.seller.avatarUrl}
                      alt={listing.seller.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {listing.seller.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
                      {listing.seller.name}
                    </h3>
                    {listing.seller.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Member since {listing.seller.memberSince}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {[listing.location.city, listing.location.state].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {/* Desktop Direct Actions */}
              <div className="space-y-2 pt-2 hidden md:block">
                {isOwner ? (
                  <Button
                    type="button"
                    onClick={() => setIsBoostModalOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Boost This Listing</span>
                  </Button>
                ) : (
                  <>
                    <Link
                      href={`/chats?recipientId=${encodeURIComponent(listing.seller.id)}&listingId=${encodeURIComponent(listing.id)}`}
                      onClick={handleChatClick}
                      className="block w-full"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat with Seller</span>
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => alert(`Seller phone: ${listing.seller.phoneMasked || '+91 98XXX XXXXX'}`)}
                      className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Call Seller ({listing.seller.phoneMasked || 'Show Number'})</span>
                    </button>
                  </>
                )}
              </div>

              <div className="pt-2 text-center border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href={`/profile/${listing.seller.id}`}
                  className="text-xs font-semibold text-orange-600 hover:underline"
                >
                  View Seller Profile & Other Ads →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Product Reels Section (if available) */}
        {relatedReels.length > 0 && (
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  Related Product Reels
                </h2>
                <p className="text-xs text-zinc-500">
                  Short video walkarounds linked to this product or creator
                </p>
              </div>
              <Link href="/reels" className="text-xs font-bold text-orange-600 hover:underline">
                Explore all Reels →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedReels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          </div>
        )}

        {/* More From This Seller (if available) */}
        {sellerListings.length > 0 && (
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  More from {listing.seller.name}
                </h2>
                <p className="text-xs text-zinc-500">
                  Other verified classifieds posted by this seller
                </p>
              </div>
              <Link href={`/profile/${listing.seller.id}`} className="text-xs font-bold text-orange-600 hover:underline">
                View all seller ads →
              </Link>
            </div>
            <ListingGrid listings={sellerListings} />
          </div>
        )}

        {/* Related Listings from Category */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                More in {listing.category}
              </h2>
              <p className="text-xs text-zinc-500">
                Explore similar pre-owned ads in this category
              </p>
            </div>
            <Link href={`/categories/${listing.category}`} className="text-xs font-bold text-orange-600 hover:underline">
              See all in {listing.category} →
            </Link>
          </div>
          <ListingGrid listings={relatedListings} />
        </div>
      </PageContainer>

      {/* ── STICKY BOTTOM ACTION BAR ON MOBILE (320px - 767px) ── */}
      {/* Positioned safely above BottomNav with safe-area spacing */}
      <div className="md:hidden fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {isOwner ? (
            <button
              type="button"
              onClick={() => setIsBoostModalOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Boost Listing</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove favourite' : 'Save favourite'}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0 active:scale-95 transition-transform"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => alert(`Seller contact: ${listing.seller.phoneMasked || '+91 98XXX XXXXX'}`)}
                className="flex-1 py-3 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call</span>
              </button>

              <Link
                href={`/chats?recipientId=${encodeURIComponent(listing.seller.id)}&listingId=${encodeURIComponent(listing.id)}`}
                onClick={handleChatClick}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Boost Modal for Listing Owner */}
      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        target={{ type: 'LISTING', id: listing.id, title: listing.title }}
      />

      {/* Unauthenticated Action Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        description={authPromptReason}
        returnUrl={`/listing/${listing.id}`}
      />
    </div>
  );
};
