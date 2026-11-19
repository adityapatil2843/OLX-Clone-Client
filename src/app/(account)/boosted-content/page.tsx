'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  ArrowLeft,
  Clapperboard,
  Package,
  RefreshCw,
  ExternalLink,
  StopCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { boostService, Advertisement } from '@/features/boost/boostService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { AuthPromptModal } from '@/components/ui/state-views';
import { formatRelativeDate } from '@/lib/formatters';

export default function BoostedContentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [advertisements, setAdvertisements] = React.useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const loadAdvertisements = React.useCallback(() => {
    setError(null);
    boostService.getMyAdvertisements({ page: 1, limit: 50 })
      .then((res) => {
        setAdvertisements(res.data || []);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(() => {
        setError('Unable to load your boosted campaigns. Please try again.');
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;
    boostService.getMyAdvertisements({ page: 1, limit: 50 })
      .then((res) => {
        if (!ignore) {
          setAdvertisements(res.data || []);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Unable to load your boosted campaigns. Please try again.');
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAdvertisements();
  };

  const handleStopBoost = async (ad: Advertisement) => {
    const confirmed = window.confirm(
      `Are you sure you want to stop boosting "${ad.title || 'this item'}"? The boost campaign will be cancelled.`
    );
    if (!confirmed) return;

    setCancellingId(ad.id);
    try {
      await boostService.cancelBoost(ad.id);
      setFeedback('Boost stopped successfully.');
      setTimeout(() => setFeedback(null), 3000);
      loadAdvertisements();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not stop boost.';
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pb-24 md:pb-12 bg-zinc-50/50 dark:bg-zinc-950/50">
      <PageContainer className="max-w-3xl space-y-4 sm:space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100">
            Boosted Content
          </h1>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh campaigns"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>

        {/* Status Toast Feedback */}
        {feedback && (
          <div
            role="status"
            className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-center animate-fade-in"
          >
            {feedback}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadAdvertisements}
              className="font-bold underline text-red-800 dark:text-red-200 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content List */}
        {isLoading ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 space-y-2">
            <Loader2 className="w-7 h-7 animate-spin text-orange-600" />
            <span className="text-xs font-medium">Loading boosted campaigns...</span>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              No boosted content yet
            </h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Boost your classified listings and product reels from their item pages or wallet to gain 10x higher visibility across India.
            </p>
            <div className="pt-2">
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all"
              >
                <span>View Coin Wallet & Packages</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {advertisements.map((ad) => {
              const isListing = ad.targetType === 'LISTING';
              const isActive = ad.status === 'ACTIVE';

              return (
                <div
                  key={ad.id}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3"
                >
                  {/* Top Row: Target Type & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {isListing ? (
                        <Package className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Clapperboard className="w-4 h-4 text-rose-500" />
                      )}
                      <span>{ad.targetType}</span>
                    </div>

                    <Badge
                      variant={isActive ? 'brand' : 'outline'}
                      className={isActive ? 'bg-emerald-600 text-white border-0' : 'text-zinc-500'}
                    >
                      {ad.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {ad.listing?.title || ad.reel?.caption || ad.title}
                  </h3>

                  {/* Meta Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                    {ad.packageDays && (
                      <span>Duration: <strong className="text-zinc-800 dark:text-zinc-200">{ad.packageDays} Days</strong></span>
                    )}
                    {ad.coinsSpent && (
                      <span>Cost: <strong className="text-orange-600 dark:text-orange-400">{ad.coinsSpent} Coins</strong></span>
                    )}
                    {ad.endDate && (
                      <span>
                        {isActive
                          ? `Ends ${formatRelativeDate(ad.endDate)}`
                          : `Ended on ${new Date(ad.endDate).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <Link
                      href={isListing ? `/listing/${ad.targetId}` : `/reels/${ad.targetId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      <span>View {isListing ? 'Listing' : 'Reel'}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </Link>

                    {isActive && (
                      <button
                        type="button"
                        onClick={() => handleStopBoost(ad)}
                        disabled={cancellingId === ad.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold text-red-600 transition-colors"
                      >
                        {cancellingId === ad.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <StopCircle className="w-3 h-3" />
                        )}
                        <span>Stop Boost</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>

      {/* Guest Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        description="Sign in to view your boosted content and promotions."
        returnUrl="/boosted-content"
      />
    </div>
  );
}
