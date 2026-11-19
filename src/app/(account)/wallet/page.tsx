'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Coins,
  ArrowLeft,
  ArrowDownLeft,
  Gift,
  Zap,
  RotateCcw,
  Clock,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { walletService, CoinTransaction } from '@/features/wallet/walletService';
import { boostService, BoostPackage } from '@/features/boost/boostService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { AuthPromptModal } from '@/components/ui/state-views';
import { formatRelativeDate } from '@/lib/formatters';

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const [balance, setBalance] = React.useState<number | null>(null);
  const [transactions, setTransactions] = React.useState<CoinTransaction[]>([]);
  const [packages, setPackages] = React.useState<BoostPackage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;
    Promise.all([
      walletService.getBalance(),
      walletService.getTransactions(1, 30),
      boostService.getPackages().catch(() => []),
    ])
      .then(([balanceRes, txRes, packagesRes]) => {
        if (!ignore) {
          setBalance(balanceRes.coinsBalance);
          setTransactions(txRes.data || []);
          setPackages(packagesRes);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Unable to load wallet data. Please check your connection and retry.');
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
    setError(null);
    Promise.all([
      walletService.getBalance(),
      walletService.getTransactions(1, 30),
      boostService.getPackages().catch(() => []),
    ])
      .then(([balanceRes, txRes, packagesRes]) => {
        setBalance(balanceRes.coinsBalance);
        setTransactions(txRes.data || []);
        setPackages(packagesRes);
        setIsRefreshing(false);
      })
      .catch(() => {
        setError('Unable to load wallet data. Please check your connection and retry.');
        setIsRefreshing(false);
      });
  };

  const renderTransactionIcon = (type: string) => {
    switch (type) {
      case 'WELCOME_BONUS':
        return <Gift className="w-4 h-4 text-emerald-600" />;
      case 'BOOST_SPENT':
        return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'REFUND':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'PURCHASE':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      default:
        return <Coins className="w-4 h-4 text-zinc-700" />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] pb-24 md:pb-12 bg-zinc-50/50 dark:bg-zinc-950/50">
      <PageContainer className="max-w-3xl space-y-4 sm:space-y-6">
        {/* Top Header Bar */}
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
            Wallet & Marketplace Coins
          </h1>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh wallet data"
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>

        {/* Guest View Prompt */}
        {!isAuthenticated && !isAuthLoading && (
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto">
              <Coins className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Sign In to Access Your Wallet
            </h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Track your coin balance, view promotion history, and boost your listings across Bazarr 360 India.
            </p>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Authenticated Wallet Dashboard */}
        {isAuthenticated && (
          <>
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
                  onClick={handleRefresh}
                  className="font-bold underline text-red-800 dark:text-red-200 hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Hero Coin Balance Card (Mobile Parity) */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-300 dark:border-amber-500/30 bg-white dark:bg-zinc-900 p-6 sm:p-8 text-center shadow-md space-y-2">
              <div className="w-14 h-14 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Coins className="w-7 h-7" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block pt-1">
                Total Available Coins
              </span>

              {isLoading && balance === null ? (
                <div className="py-2 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                </div>
              ) : (
                <div className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {balance ?? 0}
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Use coins to boost your classified listings and product reels to the top of search results.
              </p>

              {/* Quick Link to Boosted Content */}
              <div className="pt-3 flex items-center justify-center gap-3">
                <Link
                  href="/boosted-content"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>View Boosted Content</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </Link>
              </div>
            </div>

            {/* Available Boost Packages Showcase */}
            {packages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Available Boost Packages</span>
                  </h2>
                  <span className="text-[11px] text-zinc-400">10x More Reach</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between shadow-2xs space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                            {pkg.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                            {pkg.durationDays} Days
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Featured across search & reels
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-baseline justify-between">
                        <span className="text-[10px] font-medium text-zinc-400">Cost:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-orange-600 dark:text-orange-400">
                            {pkg.coinsCost}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">coins</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coin Transaction Ledger History */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span>Coin Transaction History</span>
              </div>

              {isLoading && transactions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  <span className="text-xs">Loading transaction history...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                  <Coins className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto" />
                  <h3 className="font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                    No coin transactions yet
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                    Your welcome bonus and boost deductions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                      >
                        {/* Left: Icon & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              isPositive
                                ? 'bg-emerald-50 dark:bg-emerald-950/40'
                                : 'bg-amber-50 dark:bg-amber-950/40'
                            }`}
                          >
                            {renderTransactionIcon(tx.type)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                              {tx.reason || tx.type.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              {formatRelativeDate(tx.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Right: Amount & Balance Snapshot */}
                        <div className="text-right shrink-0 pl-2">
                          <span
                            className={`text-sm font-extrabold ${
                              isPositive ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {isPositive ? `+${tx.amount}` : tx.amount}
                          </span>
                          <span className="block text-[10px] text-zinc-400 font-medium">
                            Bal: {tx.balanceAfter}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </PageContainer>

      {/* Guest Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        description="Sign in to view your coin wallet and boost packages."
        returnUrl="/wallet"
      />
    </div>
  );
}
