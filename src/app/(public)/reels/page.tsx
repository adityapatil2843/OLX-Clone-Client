import { Film } from 'lucide-react';
import { ReelsFeed } from '@/components/reels/ReelsFeed';
import { ErrorState, EmptyState } from '@/components/ui/state-views';
import { reelsService, mapBackendReelToReelItem } from '@/features/reels/reelsService';
import { MOCK_REELS } from '@/features/reels/mockData';
import { ReelItem } from '@/types/reel';
import { env } from '@/lib/env';

export const metadata = {
  title: `Watch Product Video Reels - ${env.appName}`,
  description: `Discover second-hand cars, electronics, mobiles, and real estate through 60-second video walkthroughs on ${env.appName}.`,
  alternates: {
    canonical: `${env.appUrl}/reels`,
  },
  openGraph: {
    title: `Watch Product Video Reels - ${env.appName}`,
    description: 'Discover second-hand items and properties with authentic seller video tours.',
    url: `${env.appUrl}/reels`,
    images: [{ url: `${env.appUrl}/images/logo-1.png`, width: 800, height: 800, alt: env.appName }],
  },
};

export default async function ReelsPage() {
  let reels: ReelItem[] = [];
  let hasError = false;

  try {
    const res = await reelsService.getReels({ limit: 20 });
    reels = (res.data || []).map(mapBackendReelToReelItem);
  } catch {
    hasError = true;
  }

  // Graceful fallback during development/offline if backend returns empty or is unreachable
  if (reels.length === 0) {
    reels = MOCK_REELS;
    hasError = false;
  }

  return (
    <div className="min-h-screen bg-black pb-16 text-white md:pb-0">
      {hasError ? (
        <ErrorState
          status={500}
          title="Unable to load product reels"
          description="Could not connect to reels server service. Please verify your connection or try again shortly."
        />
      ) : reels.length === 0 ? (
        <EmptyState
          title="No product reels yet"
          description="Be the first seller to record and upload a video demo for your product!"
          actionLabel="Upload Reel Ad"
          actionHref="/sell"
          icon={Film}
        />
      ) : (
        <ReelsFeed reels={reels} />
      )}
    </div>
  );
}
