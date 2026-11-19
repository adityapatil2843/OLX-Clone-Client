'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search as SearchIcon, 
  MapPin, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ListingSkeletonGrid, ErrorState } from '@/components/ui/state-views';
import { SearchFilterDrawer, FilterValues } from './SearchFilterDrawer';
import { LocationSelectorModal } from '@/components/location/LocationSelectorModal';
import { formatINR } from '@/lib/formatters';
import { categoriesService, BackendCategory } from '@/features/marketplace/categoriesService';
import { 
  listingsService, 
  mapBackendListingToListingItem, 
  MAX_LISTING_LIMIT 
} from '@/features/marketplace/listingsService';
import { ListingItem } from '@/types/listing';

export interface SearchPageViewProps {
  initialQuery?: string;
  initialCategory?: string;
  initialCity?: string;
  initialState?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialSort?: string;
  initialPage?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const SearchPageView: React.FC<SearchPageViewProps> = ({
  initialQuery = '',
  initialCategory = '',
  initialCity = '',
  initialState = '',
  initialMinPrice = '',
  initialMaxPrice = '',
  initialSort = 'newest',
  initialPage = '1',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current parameters directly from query if available
  const q = searchParams.get('q') ?? initialQuery;
  const categoryParam = searchParams.get('category') ?? initialCategory;
  const city = searchParams.get('city') ?? initialCity;
  const state = searchParams.get('state') ?? initialState;
  const minPrice = searchParams.get('minPrice') ?? initialMinPrice;
  const maxPrice = searchParams.get('maxPrice') ?? initialMaxPrice;
  const sort = (searchParams.get('sort') || searchParams.get('sortBy') || initialSort) as
    | 'newest'
    | 'price_asc'
    | 'price_desc';
  const pageNumber = Math.max(1, parseInt(searchParams.get('page') ?? initialPage, 10) || 1);

  const [searchInput, setSearchInput] = React.useState(q);
  const [prevQ, setPrevQ] = React.useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setSearchInput(q);
  }

  const [categories, setCategories] = React.useState<BackendCategory[]>([]);
  const [listings, setListings] = React.useState<ListingItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown | null>(null);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);

  // Fetch categories on mount
  React.useEffect(() => {
    let mounted = true;
    categoriesService
      .getCategories('tree')
      .then((cats) => {
        if (mounted) setCategories(cats || []);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Resolve category slug or ID to UUID
  const resolvedCategoryId = React.useMemo(() => {
    if (!categoryParam) return undefined;
    if (UUID_REGEX.test(categoryParam)) return categoryParam;

    const target = categoryParam.toLowerCase();
    const findCategory = (cats: BackendCategory[]): BackendCategory | undefined => {
      for (const cat of cats) {
        if (cat.slug.toLowerCase() === target || cat.id.toLowerCase() === target) return cat;
        if (cat.children && cat.children.length > 0) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const match = findCategory(categories);
    return match ? match.id : undefined;
  }, [categoryParam, categories]);

  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // Fetch listings whenever filters or page changes
  React.useEffect(() => {
    let isMounted = true;
    const minP = minPrice ? Number(minPrice) : undefined;
    const maxP = maxPrice ? Number(maxPrice) : undefined;

    listingsService
      .getListings({
        search: q || undefined,
        categoryId: resolvedCategoryId,
        city: city && city !== 'All India' ? city : undefined,
        state: state || undefined,
        minPrice: Number.isFinite(minP) ? minP : undefined,
        maxPrice: Number.isFinite(maxP) ? maxP : undefined,
        sortBy: sort,
        page: pageNumber,
        limit: MAX_LISTING_LIMIT,
      })
      .then((res) => {
        if (!isMounted) return;
        const mapped = (res.data || []).map(mapBackendListingToListingItem);
        setListings(mapped);
        setTotalCount(res.meta?.total || 0);
        setTotalPages(res.meta?.totalPages || 1);
        setHasNextPage(Boolean(res.meta?.hasNextPage));
        setIsLoading(false);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err);
        setListings([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [q, resolvedCategoryId, city, state, minPrice, maxPrice, sort, pageNumber, retryCount]);

  // Push new query parameters to URL
  const updateQueryParams = (updates: Record<string, string | undefined>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val && val !== 'All India') {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    if (resetPage) {
      params.delete('page');
    }

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: searchInput.trim() || undefined });
  };

  const handleCategorySelect = (selectedSlug: string) => {
    if (categoryParam.toLowerCase() === selectedSlug.toLowerCase()) {
      updateQueryParams({ category: undefined });
    } else {
      updateQueryParams({ category: selectedSlug || undefined });
    }
  };

  const handleClearFilter = (key: string) => {
    updateQueryParams({ [key]: undefined });
  };

  const handleClearAll = () => {
    setSearchInput('');
    router.push('/search');
  };

  const handleApplyDrawerFilters = (filters: FilterValues) => {
    updateQueryParams({
      category: filters.category,
      state: filters.state,
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sortBy,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQueryParams({ page: String(newPage) }, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count active filters (excluding sort)
  const activeFiltersCount = [
    categoryParam,
    city && city !== 'All India' ? city : null,
    state,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  return (
    <PageContainer className="space-y-4 sm:space-y-6 pb-24 md:pb-12">
      {/* Search Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Explore Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Discover verified second-hand items, automobiles, gadgets and properties across India.
          </p>
        </div>

        {/* Search Input Bar with Filter Button */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs"
        >
          {/* Location Trigger Pill */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            aria-label={`Select location. Current: ${city || state || 'All India'}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold sm:w-48 shrink-0 text-left hover:border-orange-500 transition-colors"
          >
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="truncate text-zinc-800 dark:text-zinc-200 font-medium">
              {city || state || 'All India'}
            </span>
          </button>

          {/* Search Term Input */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm">
            <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Cars, Mobiles, Laptops, Furniture..."
              className="w-full bg-transparent outline-none text-xs sm:text-sm placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-50"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateQueryParams({ q: undefined });
                }}
                aria-label="Clear search input"
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Filter Drawer Trigger & Search Submit */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              aria-label={`Open filters. ${activeFiltersCount} active`}
              className="relative px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <SearchIcon className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => handleCategorySelect('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shrink-0 ${
            !categoryParam
              ? 'bg-orange-600 text-white border-transparent'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-orange-500'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isSelected = categoryParam.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shrink-0 ${
                isSelected
                  ? 'bg-orange-600 text-white border-transparent'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-orange-500'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Active Filter Chips Row */}
      {(q || categoryParam || (city && city !== 'All India') || state || minPrice || maxPrice) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-zinc-400 mr-1">Active:</span>

          {q && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
              {`Query: "${q}"`}
              <button
                type="button"
                onClick={() => handleClearFilter('q')}
                aria-label="Remove query filter"
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {categoryParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-medium border border-orange-200 dark:border-orange-900/40">
              {`Category: ${categoryParam}`}
              <button
                type="button"
                onClick={() => handleClearFilter('category')}
                aria-label="Remove category filter"
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {city && city !== 'All India' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
              {`City: ${city}`}
              <button
                type="button"
                onClick={() => handleClearFilter('city')}
                aria-label="Remove city filter"
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {state && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
              State: {state}
              <button
                type="button"
                onClick={() => handleClearFilter('state')}
                aria-label="Remove state filter"
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700">
              Price: {minPrice ? formatINR(Number(minPrice)) : '₹0'} -{' '}
              {maxPrice ? formatINR(Number(maxPrice)) : 'Any'}
              <button
                type="button"
                onClick={() => {
                  handleClearFilter('minPrice');
                  handleClearFilter('maxPrice');
                }}
                aria-label="Remove price filter"
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-orange-600 hover:underline px-2 py-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Stats & Results Count Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
        <span className="font-bold text-zinc-800 dark:text-zinc-200">
          {totalCount} {totalCount === 1 ? 'Ad' : 'Ads'} Available
        </span>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-zinc-500">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            aria-label="Sort search results"
            value={sort}
            onChange={(e) => updateQueryParams({ sort: e.target.value })}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 font-semibold text-xs text-zinc-800 dark:text-zinc-200 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Results View */}
      {isLoading ? (
        <ListingSkeletonGrid count={8} />
      ) : error ? (
        <ErrorState
          error={error}
          title="Unable to load listings"
          description="We encountered an error loading items from the marketplace. Please check your network and retry."
          onRetry={handleRetry}
        />
      ) : (
        <>
          <ListingGrid
            listings={listings}
            emptyTitle="No ads found matching your criteria"
            emptyDescription="We could not find any listings matching your active filters. Try broadening your keywords, resetting location, or clearing price ranges."
          />

          {/* Bounded Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber <= 1}
                aria-label="Previous Page"
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold flex items-center gap-1 hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Page {pageNumber} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber >= totalPages || !hasNextPage}
                aria-label="Next Page"
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold flex items-center gap-1 hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <SearchFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        initialFilters={{
          category: categoryParam,
          state,
          city,
          minPrice,
          maxPrice,
          sortBy: sort,
        }}
        onApplyFilters={handleApplyDrawerFilters}
        categories={categories}
      />

      {/* Location Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={city}
        selectedState={state}
        onSelectLocation={(loc) => {
          updateQueryParams({
            city: loc.city,
            state: loc.state,
          });
        }}
      />
    </PageContainer>
  );
};
