import * as React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPageView } from '@/components/search/SearchPageView';
import { PageContainer } from '@/components/ui/page-container';
import { ListingSkeletonGrid } from '@/components/ui/state-views';
import { env } from '@/lib/env';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    state?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
  const params = await props.searchParams;
  const q = params.q || '';
  const category = params.category || '';
  const city = params.city || '';
  const state = params.state || '';

  let title = `Explore Marketplace - ${env.appName}`;
  if (q) title = `"${q}" in Marketplace - ${env.appName}`;
  else if (category) title = `${category} Listings - ${env.appName}`;
  else if (city && city !== 'All India') title = `Listings in ${city} - ${env.appName}`;
  else if (state) title = `Listings in ${state} - ${env.appName}`;

  return {
    title,
    description: `Search and discover verified pre-owned cars, phones, electronics, properties and jobs across India on ${env.appName}.`,
    alternates: {
      canonical: `${env.appUrl}/search`,
    },
    openGraph: {
      title,
      description: `Explore thousands of verified marketplace items on ${env.appName}.`,
      url: `${env.appUrl}/search`,
      siteName: env.appName,
    },
  };
}

export default async function SearchPage(props: SearchPageProps) {
  const params = await props.searchParams;

  return (
    <Suspense
      fallback={
        <PageContainer className="space-y-6 pb-24 md:pb-12">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          </div>
          <ListingSkeletonGrid count={6} />
        </PageContainer>
      }
    >
      <SearchPageView
        initialQuery={params.q || ''}
        initialCategory={params.category || ''}
        initialCity={params.city || ''}
        initialState={params.state || ''}
        initialMinPrice={params.minPrice || ''}
        initialMaxPrice={params.maxPrice || ''}
        initialSort={params.sort || params.sortBy || 'newest'}
        initialPage={params.page || '1'}
      />
    </Suspense>
  );
}
