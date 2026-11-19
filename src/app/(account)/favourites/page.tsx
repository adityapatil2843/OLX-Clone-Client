'use client';

import * as React from 'react';
import { Heart, Film, ShoppingBag, RefreshCw } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingItem } from '@/types/listing';
import { wishlistService } from '@/features/marketplace/wishlistService';
import { mapBackendListingToListingItem } from '@/features/marketplace/listingsService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { EmptyState, ErrorState } from '@/components/ui/state-views';

export default function FavouritesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [activeTab, setActiveTab] = React.useState<'listings' | 'reels'>('listings');
  const [savedListings, setSavedListings] = React.useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const loadWishlist = React.useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    wishlistService
      .getWishlist({ page: 1, limit: 50 })
      .then((res) => {
        if (!isMounted) return;
        const mapped = (res.data || []).map((item) => ({
          ...mapBackendListingToListingItem(item),
          isWishlisted: true,
        }));
        setSavedListings(mapped);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorMessage('Could not load your saved favourites. Please try again.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, refreshTrigger]);

  return (
    <PageContainer className="space-y-4 sm:space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
              Saved Favourites
            </h1>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Bookmarked listings and reels you are tracking.
          </p>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={loadWishlist}
            disabled={isLoading}
            aria-label="Refresh wishlist"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <EmptyState
          title="Sign in to view your favourites"
          description="Keep track of your favorite vehicles, electronics, properties and product reels across all your devices."
          actionLabel="Sign In with Email"
          actionHref="/login?redirect=/favourites"
          icon={Heart}
        />
      ) : (
        <>
          {/* Tabs Bar */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ${
                activeTab === 'listings'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Listings ({savedListings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reels')}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ${
                activeTab === 'reels'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels (0)</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'listings' ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-zinc-500 animate-pulse">
                  Loading saved favourites...
                </div>
              ) : errorMessage ? (
                <ErrorState
                  status={500}
                  title="Unable to load wishlist"
                  description={errorMessage}
                />
              ) : (
                <div data-testid="wishlist-container">
                  <ListingGrid
                    listings={savedListings}
                    emptyTitle="No saved listings"
                    emptyDescription="Tap the heart icon on any listing to save it here for quick access."
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState
                title="No saved reels"
                description="When you bookmark reels in the reels feed, they will appear here once saved reels sync is enabled."
                icon={Film}
              />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
