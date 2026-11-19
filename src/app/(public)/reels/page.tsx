import * as React from 'react';
import Link from 'next/link';
import { Film, PlusCircle } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { ReelCard } from '@/components/reels/ReelCard';
import { ErrorState, EmptyState } from '@/components/ui/state-views';
import { reelsService, mapBackendReelToReelItem } from '@/features/reels/reelsService';
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

  return (
    <PageContainer size="wide" className="space-y-4 sm:space-y-6 pb-20 sm:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wide uppercase mb-1 border border-rose-500/20">
            <Film className="w-3.5 h-3.5" />
            <span>Product Video Discovery</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Bazarr Product Reels
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-xl">
            Authentic 60-second video walkthroughs recorded by genuine sellers across India. Tap any linked product pill to inspect details or start direct chat.
          </p>
        </div>

        <Link
          href="/sell"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Reel Ad</span>
        </Link>
      </div>

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
        <>
          {/* Mobile App-Like Feed on small screens (<768px) */}
          <div className="md:hidden flex flex-col items-center space-y-6 snap-y snap-mandatory">
            {reels.map((reel) => (
              <div key={reel.id} className="snap-start w-full max-w-sm">
                <ReelCard reel={reel} isFeedMode={true} />
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Multi-column Grid (>= 768px) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} isFeedMode={false} />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
