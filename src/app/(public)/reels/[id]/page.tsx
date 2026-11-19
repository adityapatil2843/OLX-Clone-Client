import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Film } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ReelCard } from '@/components/reels/ReelCard';
import { ErrorState } from '@/components/ui/state-views';
import { reelsService, mapBackendReelToReelItem } from '@/features/reels/reelsService';
import { getReelCanonicalUrl } from '@/lib/share';
import { env } from '@/lib/env';

interface ReelDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: ReelDetailPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const canonicalUrl = getReelCanonicalUrl(id);

  try {
    const raw = await reelsService.getReelById(id);
    if (!raw) {
      throw new Error('Not found');
    }
    const reel = mapBackendReelToReelItem(raw);
    const imageUrl = reel.customThumbnailUrl || reel.thumbnailUrl || `${env.appUrl}/images/logo-1.png`;

    return {
      title: `${reel.title} - ${env.appName} Product Reel`,
      description: `Watch short video demo for ${reel.title} by verified seller ${reel.creator.name} on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${reel.title} - ${env.appName} Reel`,
        description: `Watch this product reel by ${reel.creator.name} on ${env.appName}`,
        url: canonicalUrl,
        images: [
          {
            url: imageUrl,
            width: 720,
            height: 1280,
            alt: reel.title,
          },
        ],
        type: 'video.other',
        siteName: env.appName,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${reel.title} - ${env.appName} Product Reel`,
        description: `Watch this product reel by ${reel.creator.name} on ${env.appName}`,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: `Reel Not Found - ${env.appName}`,
      description: `The requested product reel does not exist or has expired on ${env.appName}.`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

export default async function ReelDetailPage(props: ReelDetailPageProps) {
  const { id } = await props.params;
  let matchedReel = null;

  try {
    const raw = await reelsService.getReelById(id);
    if (raw) {
      matchedReel = mapBackendReelToReelItem(raw);
    }
  } catch {
    matchedReel = null;
  }

  if (!matchedReel) {
    return (
      <PageContainer size="narrow" className="py-12 sm:py-20 pb-24 md:pb-12 text-center">
        <ErrorState
          status={404}
          title="Product Reel Not Found"
          description={`We could not find reel "${id}". It may have expired or been deleted by the creator.`}
        />
        <div className="mt-6">
          <Link
            href="/reels"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            Watch All Reels
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="narrow" className="space-y-4 pb-24 sm:pb-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
        <Link
          href="/reels"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all Reels</span>
        </Link>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/50">
          <Film className="w-3.5 h-3.5" />
          <span>Reel #{id}</span>
        </div>
      </div>

      {/* Centered Reel Card View */}
      <div className="w-full flex justify-center py-2">
        <div className="w-full max-w-sm">
          <ReelCard reel={matchedReel} isFeedMode={true} />
        </div>
      </div>
    </PageContainer>
  );
}
