'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Film, 
  PlusCircle, 
  Car, 
  Smartphone, 
  Tv, 
  Home as HomeIcon, 
  Armchair, 
  Shirt, 
  Briefcase, 
  Wrench, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingSkeletonGrid, ErrorState } from '@/components/ui/state-views';
import { ReelCard } from '@/components/reels/ReelCard';
import { categoriesService, BackendCategory } from '@/features/marketplace/categoriesService';
import { listingsService, mapBackendListingToListingItem } from '@/features/marketplace/listingsService';
import { ListingItem } from '@/types/listing';
import { CITIES_LIST } from '@/features/marketplace/mockData';
import { MOCK_REELS } from '@/features/reels/mockData';

const CATEGORY_SLUG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  vehicles: Car,
  cars: Car,
  mobiles: Smartphone,
  phones: Smartphone,
  electronics: Tv,
  properties: HomeIcon,
  furniture: Armchair,
  fashion: Shirt,
  jobs: Briefcase,
  services: Wrench,
};

function getCategoryIcon(slug: string): React.ComponentType<{ className?: string }> {
  const normalized = slug.toLowerCase();
  for (const [key, IconComp] of Object.entries(CATEGORY_SLUG_ICONS)) {
    if (normalized.includes(key)) return IconComp;
  }
  return Tag;
}

export default function HomePage() {
  const [categories, setCategories] = React.useState<BackendCategory[]>([]);
  const [listings, setListings] = React.useState<ListingItem[]>([]);
  const [isLoadingListings, setIsLoadingListings] = React.useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
  const [listingsError, setListingsError] = React.useState<unknown | null>(null);
  const [categoriesError, setCategoriesError] = React.useState<unknown | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = React.useCallback(() => {
    setIsLoadingListings(true);
    setIsLoadingCategories(true);
    setListingsError(null);
    setCategoriesError(null);
    setRetryCount((c) => c + 1);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      categoriesService.getCategories('tree'),
      listingsService.getListings({ limit: 8, sortBy: 'newest' }),
    ]).then(([catResult, listResult]) => {
      if (!isMounted) return;

      if (catResult.status === 'fulfilled') {
        setCategories(catResult.value || []);
      } else {
        setCategoriesError(catResult.reason);
      }
      setIsLoadingCategories(false);

      if (listResult.status === 'fulfilled') {
        const items = (listResult.value.data || []).map(mapBackendListingToListingItem);
        setListings(items);
      } else {
        setListingsError(listResult.reason);
      }
      setIsLoadingListings(false);
    });

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-8 pb-24 md:pb-12">
      <h1 className="sr-only">Bazarr 360 - India&apos;s Free Video-First Marketplace</h1>

      {/* ── MOBILE SEARCH & QUICK ACTIONS (320px - 767px) ── */}
      <div className="md:hidden px-3.5 pt-2 pb-1 space-y-3">
        {/* Mobile Search Input */}
        <form
          action="/search"
          method="GET"
          className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs"
        >
          <Search className="w-4 h-4 text-zinc-400 ml-1 shrink-0" />
          <input
            type="text"
            name="q"
            aria-label="Search Cars, Mobiles, Bikes, Flats"
            placeholder="Search Cars, Mobiles, Bikes, Flats..."
            className="w-full bg-transparent outline-none text-xs text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            aria-label="Submit Search"
            className="p-1.5 rounded-xl bg-orange-600 text-white shrink-0 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mobile Category Shortcuts - Horizontal App Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none -mx-3.5 px-3.5">
          {isLoadingCategories ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 shrink-0 animate-pulse">
                <div className="w-13 h-13 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-10 h-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800 border border-orange-200/60 dark:border-zinc-700 flex items-center justify-center text-orange-600 dark:text-orange-400 group-active:scale-95 transition-transform shadow-2xs">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 text-center max-w-[64px] truncate leading-tight">
                    {cat.name}
                  </span>
                </Link>
              );
            })
          ) : null}
        </div>
      </div>

      {/* ── DESKTOP HERO SECTION (768px+) ── */}
      <section className="hidden md:block relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white py-12 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.18),transparent_50%)] pointer-events-none" />
        <PageContainer className="relative z-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold tracking-wide uppercase">
              <Film className="w-3.5 h-3.5" />
              <span>India&apos;s First Video Marketplace</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
              Buy, Sell & Discover with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Short Video Reels</span>
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Experience pre-owned cars, phones, laptops, and properties in authentic 60-second video tours before making direct contact with local verified sellers.
            </p>
          </div>

          {/* Quick Search Box */}
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-3xl shadow-2xl">
            <form action="/search" method="GET" className="flex flex-row gap-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-semibold w-48 shrink-0">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <select
                  name="city"
                  aria-label="Filter by City"
                  defaultValue="All India"
                  className="w-full bg-transparent outline-none cursor-pointer text-xs"
                >
                  {CITIES_LIST.map((city) => (
                    <option key={city} value={city} className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Find Cars, Bikes, Mobile Phones, Laptops, Flats..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-50"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Quick Value Guarantees */}
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>100% Free Consumer Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Video Reels Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Direct Chat with Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Pan-India Discovery</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ── DESKTOP CATEGORIES GRID (768px+) ── */}
      <div className="hidden md:block">
        <PageContainer>
          <SectionHeading
            title="Browse Categories"
            subtitle="Explore listings organized across major verified sectors"
            actionHref="/search"
            actionLabel="View all categories"
          />

          {isLoadingCategories ? (
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse space-y-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-14 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">Categories temporarily unavailable</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 hover:shadow-md transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    {cat._count?.listings !== undefined && (
                      <span className="text-[10px] text-zinc-400 mt-0.5">
                        {cat._count.listings.toLocaleString()} ads
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </PageContainer>
      </div>

      {/* ── TRENDING PRODUCT REELS SECTION ── */}
      <section className="bg-zinc-900 text-white py-6 sm:py-10 overflow-hidden">
        <PageContainer>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                  Trending Product Reels
                </h2>
              </div>
              <p className="text-[11px] sm:text-sm text-zinc-400 mt-0.5">
                Authentic short video walkarounds recorded by verified sellers
              </p>
            </div>
            <Link
              href="/reels"
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 hover:underline shrink-0"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Horizontal Carousel */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-3 -mx-3.5 px-3.5 snap-x snap-mandatory scrollbar-none">
            {MOCK_REELS.map((reel) => (
              <div key={reel.id} className="snap-start shrink-0 w-[170px]">
                <ReelCard reel={reel} />
              </div>
            ))}
          </div>

          {/* Desktop Multi-column Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_REELS.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* ── FRESH RECOMMENDATIONS SECTION ── */}
      <PageContainer>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
              Fresh Recommendations
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Hand-picked verified listings across India
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-0.5"
          >
            <span>See more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingListings ? (
          <ListingSkeletonGrid count={8} />
        ) : listingsError ? (
          <ErrorState
            error={listingsError}
            title="Unable to load recommendations"
            description="We could not reach the server to fetch recommendations. Please check your connection and retry."
            onRetry={handleRetry}
          />
        ) : (
          <ListingGrid
            listings={listings}
            emptyTitle="No recommendations available yet"
            emptyDescription="New verified ads will appear here once sellers post them."
          />
        )}
      </PageContainer>

      {/* ── SELL CALL TO ACTION BANNER ── */}
      <PageContainer>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              Zero Listing Fees
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Post Your Ad in 60 Seconds with Video
            </h2>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Record a 60-second video reel directly from your camera to get 3x more buyer inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/sell"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-zinc-950 font-black text-xs sm:text-sm hover:bg-orange-50 transition-all shadow-md text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              <span>Start Selling</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
