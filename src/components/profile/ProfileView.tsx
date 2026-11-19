'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Film, 
  MessageSquare, 
  Share2,
  ChevronRight,
  ArrowLeft,
  Coins,
  Sparkles
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ReelCard } from '@/components/reels/ReelCard';
import { ListingItem } from '@/types/listing';
import { ReelItem } from '@/types/reel';
import { PublicUserProfile } from '@/features/users/usersService';
import { getProfileCanonicalUrl, shareContent } from '@/lib/share';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { AuthPromptModal } from '@/components/ui/state-views';

export interface ProfileViewProps {
  user: PublicUserProfile;
  listings: ListingItem[];
  reels: ReelItem[];
  canonicalUrl?: string;
  isBusiness?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  listings,
  reels,
  canonicalUrl,
  isBusiness = false,
}) => {
  const [activeTab, setActiveTab] = React.useState<'listings' | 'reels'>('listings');
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.user);

  const formattedName = user.name || (isBusiness ? 'Verified Business' : 'Verified User');
  const memberSinceFormatted = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently';

  const locationDisplay = [user.locationCity, user.locationState].filter(Boolean).join(', ') || 'India';

  const handleShareProfile = async () => {
    const url = canonicalUrl || getProfileCanonicalUrl(user.id);
    const result = await shareContent({
      title: `${formattedName} - ${isBusiness ? 'Business Storefront' : 'Seller Profile'} on Bazarr 360`,
      text: `Check out active listings and product reels by ${formattedName} on Bazarr 360`,
      url,
    });

    if (result.copied) {
      setShareFeedback('Profile link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <PageContainer className="space-y-4 sm:space-y-6 pb-24 md:pb-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5 md:hidden" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-800 dark:text-zinc-200 font-medium truncate max-w-[200px]">
            {`${isBusiness ? 'Business Storefront' : 'Seller Profile'}: ${formattedName}`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShareProfile}
          aria-label="Share seller profile"
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </nav>

      {/* Share Toast Feedback */}
      {shareFeedback && (
        <div role="status" className="rounded-xl bg-orange-600 text-white px-4 py-2 text-xs font-bold shadow-md text-center animate-fade-in">
          {shareFeedback}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-sm shrink-0 bg-orange-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-black">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={formattedName}
                fill
                className="object-cover"
              />
            ) : (
              <span>{formattedName[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {formattedName}
              </h1>
              {user.isVerifiedSeller && (
                <Badge variant="brand" className="bg-emerald-600 text-white border-0 py-0.5 px-2 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                  {isBusiness ? 'Verified Business' : 'Verified Seller'}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>{locationDisplay}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{`Member since ${memberSinceFormatted}`}</span>
              </span>
            </div>

            {user.bio && (
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl pt-1">
                {user.bio}
              </p>
            )}

            {/* Honest Stats Row (No fake ratings or reviews) */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-2.5 text-xs font-semibold">
              <div className="text-center sm:text-left">
                <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 block leading-none">
                  {listings.length}
                </span>
                <span className="text-zinc-400 text-[11px]">Active Ads</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 block leading-none">
                  {reels.length}
                </span>
                <span className="text-zinc-400 text-[11px]">Product Reels</span>
              </div>
            </div>
          </div>

          {/* Contact / Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            {currentUser?.id && currentUser.id === user.id ? (
              <>
                <Link href="/wallet" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs">
                    <Coins className="w-4 h-4" />
                    <span>My Wallet</span>
                  </Button>
                </Link>
                <Link href="/boosted-content" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full border-zinc-300 dark:border-zinc-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>Boosted Ads</span>
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/chats" onClick={handleMessageClick} className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Seller</span>
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={handleShareProfile}
              aria-label="Share seller profile link"
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Control / Tabs: Listings vs Reels */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'listings'
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{`Active Listings (${listings.length})`}</span>
          {activeTab === 'listings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative ${
            activeTab === 'reels'
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>{`Product Reels (${reels.length})`}</span>
          {activeTab === 'reels' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400" />
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'listings' ? (
        <div className="space-y-3">
          {listings.length > 0 ? (
            <ListingGrid listings={listings} />
          ) : (
            <div className="py-12 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <ShoppingBag className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No active listings</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                This seller currently does not have any active product ads listed on Bazarr 360.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {reels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Film className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No product reels</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                This seller has not posted any short-video product walkthrough reels yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Guest Authentication Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Message Seller"
        description="Sign in or register on Bazarr 360 to chat directly with verified sellers."
        returnUrl={`/profile/${user.id}`}
      />
    </PageContainer>
  );
};
