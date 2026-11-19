import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { usersService } from '@/features/users/usersService';
import { reelsService, mapBackendReelToReelItem } from '@/features/reels/reelsService';
import { ProfileView } from '@/components/profile/ProfileView';
import { PageContainer } from '@/components/ui/page-container';
import { ErrorState } from '@/components/ui/state-views';
import { ReelItem } from '@/types/reel';
import { ListingItem } from '@/types/listing';
import { getBusinessCanonicalUrl } from '@/lib/share';
import { env } from '@/lib/env';

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: BusinessPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const canonicalUrl = getBusinessCanonicalUrl(slug);

  try {
    const publicUser = await usersService.getUserProfile(slug);
    if (!publicUser) {
      return {
        title: `Business Not Found - ${env.appName}`,
        description: `This business storefront does not exist or has been removed on ${env.appName}.`,
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }

    const title = `${publicUser.name} - Verified Business Storefront | ${env.appName}`;
    const description = publicUser.bio || `Browse verified inventory, video reels, and classifieds from ${publicUser.name} on ${env.appName}.`;
    const avatar = publicUser.avatarUrl || `${env.appUrl}/images/logo-1.png`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: env.appName,
        images: [{ url: avatar, width: 800, height: 800, alt: publicUser.name }],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch {
    return {
      title: `Business Not Found - ${env.appName}`,
      description: `This business storefront does not exist or has been removed on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function BusinessPage(props: BusinessPageProps) {
  const { slug } = await props.params;
  const canonicalUrl = getBusinessCanonicalUrl(slug);

  let publicUser = null;
  try {
    publicUser = await usersService.getUserProfile(slug);
  } catch {
    publicUser = null;
  }

  if (!publicUser) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          title="Business Storefront Not Found"
          description={`We could not find a verified business storefront for "${slug}".`}
        />
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            Explore Marketplace
          </Link>
        </div>
      </PageContainer>
    );
  }

  // Load real reels for this business user from reelsService
  let userReels: ReelItem[] = [];
  try {
    const reelsRes = await reelsService.getReels({ creatorId: publicUser.id, limit: 20 });
    userReels = (reelsRes.data || []).map(mapBackendReelToReelItem);
  } catch {
    userReels = [];
  }

  const userListings: ListingItem[] = [];

  return (
    <ProfileView
      user={publicUser}
      listings={userListings}
      reels={userReels}
      canonicalUrl={canonicalUrl}
      isBusiness={true}
    />
  );
}
