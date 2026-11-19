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
import { getProfileCanonicalUrl } from '@/lib/share';
import { env } from '@/lib/env';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: ProfilePageProps): Promise<Metadata> {
  const { id } = await props.params;
  const canonicalUrl = getProfileCanonicalUrl(id);

  try {
    const publicUser = await usersService.getUserProfile(id);
    if (!publicUser) {
      return {
        title: `Seller Not Found - ${env.appName}`,
        description: `This seller profile does not exist or has been removed on ${env.appName}.`,
        alternates: {
          canonical: canonicalUrl,
        },
      };
    }

    const title = `${publicUser.name} - Seller Profile | ${env.appName}`;
    const description = publicUser.bio || `View active ads and verified product reels for ${publicUser.name} on ${env.appName}.`;
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
      title: `Seller Not Found - ${env.appName}`,
      description: `This seller profile does not exist or has been removed on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { id } = await props.params;

  let publicUser = null;
  try {
    publicUser = await usersService.getUserProfile(id);
  } catch {
    publicUser = null;
  }

  if (!publicUser) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          title="Seller Profile Not Found"
          description={`We could not find a seller account for "${id}". This account may have been deleted or deactivated.`}
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

  // Load real reels for this user from reelsService
  let userReels: ReelItem[] = [];
  try {
    const reelsRes = await reelsService.getReels({ creatorId: publicUser.id, limit: 20 });
    userReels = (reelsRes.data || []).map(mapBackendReelToReelItem);
  } catch {
    userReels = [];
  }

  // Real listings: Backend does not have an ownerId query filter on GET /api/v1/listings
  const userListings: ListingItem[] = [];

  return (
    <ProfileView
      user={publicUser}
      listings={userListings}
      reels={userReels}
    />
  );
}
