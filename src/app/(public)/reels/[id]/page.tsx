import { cache, Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Film } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ReelCard } from '@/components/reels/ReelCard';
import { ErrorState } from '@/components/ui/state-views';
import { reelsService, mapBackendReelToReelItem } from '@/features/reels/reelsService';
import { MOCK_REELS } from '@/features/reels/mockData';
import { BackendReel } from '@/types/reel';
import { getReelCanonicalUrl } from '@/lib/share';
import { env } from '@/lib/env';

interface ReelDetailPageProps {
  params: Promise<{ id: string }>;
}

const getCachedReel = cache(async (id: string) => {
  try {
    const reel = await reelsService.getReelById(id);
    if (reel) return reel;
  } catch {
    // fallback to mock below
  }

  const mock = MOCK_REELS.find((r) => r.id === id);
  if (mock) {
    return {
      id: mock.id,
      title: mock.title,
      description: mock.description,
      videoUrl: mock.videoUrl,
      thumbnailUrl: mock.thumbnailUrl,
      status: 'PUBLISHED',
      creatorId: mock.creator.id,
      creator: {
        id: mock.creator.id,
        name: mock.creator.name,
        avatarUrl: mock.creator.avatarUrl,
        isVerifiedSeller: mock.creator.isVerified,
      },
      listing: mock.listingId
        ? {
            id: mock.listingId,
            title: mock.title,
            price: mock.price || 0,
          }
        : null,
      likesCount: mock.metrics.likes,
      commentsCount: mock.metrics.comments,
      sharesCount: mock.metrics.shares,
      viewsCount: mock.metrics.views,
      createdAt: mock.createdAt,
    } as BackendReel;
  }
  return null;
});

export async function generateMetadata(props: ReelDetailPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const canonicalUrl = getReelCanonicalUrl(id);

  try {
    const raw = await getCachedReel(id);
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

function ReelDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton Top Bar */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all Reels</span>
        </div>

        <div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse border border-zinc-200/50 dark:border-zinc-800" />
      </div>

      {/* Skeleton Card */}
      <div className="w-full flex justify-center py-2">
        <div className="w-full max-w-sm aspect-9/16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-1">
                <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
              </div>
            </div>
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ReelDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await getCachedReel(id);
  const matchedReel = raw ? mapBackendReelToReelItem(raw) : null;

  return (
    <div className="space-y-4">
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

      {!matchedReel ? (
        <div className="py-12 sm:py-20 text-center">
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
        </div>
      ) : (
        <div className="w-full flex justify-center py-2">
          <div className="w-full max-w-sm">
            <ReelCard reel={matchedReel} isFeedMode={true} priority={true} isActive={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReelDetailPage(props: ReelDetailPageProps) {
  return (
    <PageContainer size="narrow" className="space-y-4 pb-24 sm:pb-12">
      <Suspense fallback={<ReelDetailSkeleton />}>
        <ReelDetailContent params={props.params} />
      </Suspense>
    </PageContainer>
  );
}
