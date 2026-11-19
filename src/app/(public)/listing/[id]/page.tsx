import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listingsService, mapBackendListingToListingItem, BackendListing } from '@/features/marketplace/listingsService';
import { getListingCanonicalUrl } from '@/lib/share';
import { ListingDetailView } from '@/components/listings/ListingDetailView';
import { PageContainer } from '@/components/ui/page-container';
import { ErrorState } from '@/components/ui/state-views';
import { env } from '@/lib/env';
import { ListingItem } from '@/types/listing';
import { ReelItem } from '@/types/reel';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata(props: ListingPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const canonicalUrl = getListingCanonicalUrl(id);

  if (!UUID_REGEX.test(id)) {
    return {
      title: `Listing Not Found - ${env.appName}`,
      description: `The requested listing does not exist or has expired on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  let backendListing: BackendListing | null = null;
  try {
    backendListing = await listingsService.getListingById(id);
  } catch {
    // Return not found metadata
  }

  if (!backendListing) {
    return {
      title: `Listing Not Found - ${env.appName}`,
      description: `The requested listing does not exist or has expired on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  const primaryMedia = backendListing.media?.[0];
  const imageUrl = primaryMedia?.url || primaryMedia?.thumbnailKey || `${env.appUrl}/images/logo-1.png`;

  return {
    title: `${backendListing.title} - ${env.appName}`,
    description: backendListing.description
      ? backendListing.description.slice(0, 160)
      : `View verified details for ${backendListing.title} on ${env.appName}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${backendListing.title} - ${env.appName}`,
      description: `View verified listing on ${env.appName} India.`,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: backendListing.title,
        },
      ],
      type: 'website',
      siteName: env.appName,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${backendListing.title} - ${env.appName}`,
      description: `View verified listing on ${env.appName} India.`,
      images: [imageUrl],
    },
  };
}

export default async function ListingPage(props: ListingPageProps) {
  const { id } = await props.params;

  // Validate UUID upfront
  if (!UUID_REGEX.test(id)) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          title="Listing Not Found"
          description={`We could not find listing "${id}". It may have been sold, archived, or removed by the seller.`}
        />
        <div className="mt-6">
          <Link
            href="/search"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            Browse Other Listings
          </Link>
        </div>
      </PageContainer>
    );
  }

  let backendListing: BackendListing | null = null;
  let fetchError: unknown | null = null;

  try {
    backendListing = await listingsService.getListingById(id);
  } catch (err) {
    fetchError = err;
  }

  if (!backendListing || fetchError) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          error={fetchError}
          title="Listing Not Found"
          description={`We could not find listing "${id}". It may have been sold, archived, or removed by the seller.`}
        />
        <div className="mt-6">
          <Link
            href="/search"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            Browse Other Listings
          </Link>
        </div>
      </PageContainer>
    );
  }

  const mappedListing: ListingItem = mapBackendListingToListingItem(backendListing);

  // Fetch real related listings using categoryId filter on backend
  let relatedListings: ListingItem[] = [];
  if (backendListing.categoryId) {
    try {
      const relatedRes = await listingsService.getListings({
        categoryId: backendListing.categoryId,
        limit: 5,
        sortBy: 'newest',
      });
      relatedListings = (relatedRes.data || [])
        .filter((item) => item.id !== backendListing.id)
        .slice(0, 4)
        .map(mapBackendListingToListingItem);
    } catch {
      relatedListings = [];
    }
  }

  // Map attached reels if returned by the backend
  const relatedReels: ReelItem[] = (backendListing.reels || []).map((r) => ({
    id: r.id,
    videoUrl: r.videoUrl || '',
    thumbnailUrl: r.thumbnailUrl || '',
    status: (r.status || 'PUBLISHED') as ReelItem['status'],
    title: r.caption || backendListing.title,
    description: r.caption || undefined,
    price: backendListing.price,
    listingId: backendListing.id,
    creator: {
      id: backendListing.owner?.id || backendListing.ownerId || '',
      name: backendListing.owner?.name || 'Verified Seller',
      avatarUrl: backendListing.owner?.avatarUrl || undefined,
      isVerified: Boolean(backendListing.owner?.isVerifiedSeller),
    },
    metrics: {
      likes: 0,
      views: 0,
      shares: 0,
    },
    durationSeconds: 30,
    createdAt: r.createdAt || backendListing.createdAt,
    isLocalMock: false,
  }));

  return (
    <ListingDetailView
      listing={mappedListing}
      relatedListings={relatedListings}
      relatedReels={relatedReels}
      sellerListings={[]}
    />
  );
}
