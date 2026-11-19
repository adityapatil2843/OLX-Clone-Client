import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, Tag, ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { ErrorState } from '@/components/ui/state-views';
import { categoriesService, BackendCategory } from '@/features/marketplace/categoriesService';
import { listingsService, mapBackendListingToListingItem } from '@/features/marketplace/listingsService';
import { ListingItem } from '@/types/listing';
import { getCategoryCanonicalUrl } from '@/lib/share';
import { env } from '@/lib/env';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: CategoryPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  let categoryName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  let categoryDesc = `Explore verified pre-owned items, video reels, and deals in ${categoryName} on ${env.appName}.`;

  try {
    const category = await categoriesService.getCategoryByIdOrSlug(slug);
    if (category) {
      categoryName = category.name;
      if (category.description) categoryDesc = category.description;
    }
  } catch {
    // Graceful fallback for metadata generation
  }

  const title = `${categoryName} - ${env.appName}`;
  const canonicalUrl = getCategoryCanonicalUrl(slug);

  return {
    title,
    description: categoryDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: categoryDesc,
      url: canonicalUrl,
      siteName: env.appName,
      images: [{ url: `${env.appUrl}/images/logo-1.png`, width: 800, height: 800, alt: title }],
    },
    twitter: {
      card: 'summary',
      title,
      description: categoryDesc,
    },
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;

  let category: BackendCategory | null = null;
  let categoryError: unknown | null = null;

  try {
    category = await categoriesService.getCategoryByIdOrSlug(slug);
  } catch (err) {
    categoryError = err;
  }

  if (!category || categoryError) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          title="Category Not Found"
          description={`We could not find category "${slug}". It may have been removed or the slug is incorrect.`}
        />
        <div className="mt-6">
          <Link
            href="/search"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            Browse All Categories
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Fetch real listings for this category from server
  let listings: ListingItem[] = [];
  let listingsError: unknown | null = null;

  try {
    const res = await listingsService.getListings({
      categoryId: category.id,
      limit: 20,
      sortBy: 'newest',
    });
    listings = (res.data || []).map(mapBackendListingToListingItem);
  } catch (err) {
    listingsError = err;
  }

  return (
    <PageContainer className="space-y-4 sm:space-y-6 pb-24 md:pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 md:hidden" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <Link href="/search" className="hover:text-orange-600 transition-colors">Categories</Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <span className="text-zinc-900 dark:text-zinc-100 font-bold capitalize">
          {category.name}
        </span>
      </div>

      {/* Category Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-5 sm:p-8 border border-zinc-800 shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <Tag className="w-3 h-3" />
          <span>Category Catalog</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight">
          {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
          {category.description || `Browse verified second-hand items and listings in ${category.name}.`}
        </p>
      </div>

      {/* Filter / Sort Control Bar */}
      <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            {listings.length} {listings.length === 1 ? 'Ad' : 'Ads'} Available
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/search?category=${encodeURIComponent(category.slug)}`}
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            Open in Search &amp; Filter →
          </Link>
        </div>
      </div>

      {/* Listing Results or Error */}
      {listingsError ? (
        <ErrorState
          error={listingsError}
          title={`Unable to load ${category.name} listings`}
          description="We encountered an issue fetching listings for this category. Please check your network and try again."
        />
      ) : (
        <ListingGrid
          listings={listings}
          emptyTitle={`No listings currently in ${category.name}`}
          emptyDescription="Be the first to list an item in this category!"
        />
      )}
    </PageContainer>
  );
}
