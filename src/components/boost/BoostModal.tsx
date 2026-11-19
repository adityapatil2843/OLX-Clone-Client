'use client';

import * as React from 'react';
import { X, Zap, Coins, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { walletService } from '@/features/wallet/walletService';
import { boostService, BoostPackage, AdTargetType } from '@/features/boost/boostService';
import { cn } from '@/lib/utils';

export interface BoostModalTarget {
  type: AdTargetType;
  id: string;
  title: string;
}

export interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: BoostModalTarget | null;
  onSuccess?: () => void;
}

interface BoostModalContentProps {
  onClose: () => void;
  target: BoostModalTarget;
  onSuccess?: () => void;
}

const BoostModalContent: React.FC<BoostModalContentProps> = ({
  onClose,
  target,
  onSuccess,
}) => {
  const [packages, setPackages] = React.useState<BoostPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = React.useState<string | null>(null);
  const [userCoins, setUserCoins] = React.useState<number | null>(null);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ignore = false;
    Promise.all([
      walletService.getBalance().catch(() => ({ coinsBalance: 0 })),
      boostService.getPackages().catch(() => []),
    ])
      .then(([balanceRes, packagesRes]) => {
        if (!ignore) {
          setUserCoins(balanceRes.coinsBalance);
          setPackages(packagesRes);
          if (packagesRes.length > 0) {
            setSelectedPackageId(packagesRes[0].id);
          }
          setIsDataLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage('Failed to load wallet balance or boost packages. Please try again.');
          setIsDataLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onClose]);

  const currentCoins = userCoins ?? 0;
  const selectedPackage = packages.find((p) => p.id === selectedPackageId);
  const canAfford = selectedPackage ? currentCoins >= selectedPackage.coinsCost : true;
  const deficit = selectedPackage ? Math.max(0, selectedPackage.coinsCost - currentCoins) : 0;

  const handleConfirmBoost = async () => {
    if (!target || !selectedPackage || isSubmitting) return;

    if (currentCoins < selectedPackage.coinsCost) {
      setErrorMessage(
        `Insufficient coins. You have ${currentCoins} coins, but this package requires ${selectedPackage.coinsCost} coins.`
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const idempotencyKey =
      'idemp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

    try {
      await boostService.createBoost({
        targetType: target.type,
        targetId: target.id,
        packageId: selectedPackage.id,
        idempotencyKey,
      });

      // Synchronize balance
      const updatedBalance = await walletService.getBalance().catch(() => ({
        coinsBalance: currentCoins - selectedPackage.coinsCost,
      }));
      setUserCoins(updatedBalance.coinsBalance);

      setSuccessMessage(
        `"${target.title}" is now successfully boosted for ${selectedPackage.durationDays} days!`
      );
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to activate boost';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('active boost')) {
        setErrorMessage('This item already has an active boost running.');
      } else if (msg.toLowerCase().includes('insufficient') || msg.toLowerCase().includes('coins')) {
        setErrorMessage('Insufficient coin balance to activate this boost package.');
      } else if (msg.toLowerCase().includes('inactive') || msg.toLowerCase().includes('expired')) {
        setErrorMessage('This boost package or item is no longer eligible for boosting.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Boost ${target.type === 'LISTING' ? 'Listing' : 'Reel'}`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
    >
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Surface */}
      <div className="relative w-full sm:max-w-md max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                {`Boost Your ${target.type === 'LISTING' ? 'Listing' : 'Reel'}`}
              </h2>
              <p className="text-xs text-zinc-500 truncate">{target.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close boost modal"
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-4 text-xs">
          {/* User Available Coin Balance Pill Card */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Available Coin Balance:
              </span>
            </div>
            {isDataLoading && userCoins === null ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            ) : (
              <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                {currentCoins} Coins
              </span>
            )}
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Box */}
          {successMessage ? (
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                Boost Activated!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Boost Packages Selection List */}
              <div className="space-y-2">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                  Choose a Boost Package
                </h3>

                {isDataLoading && packages.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                    <span className="text-xs">Loading boost packages...</span>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="py-6 flex flex-col items-center justify-center text-zinc-400 space-y-1">
                    <Clock className="w-6 h-6" />
                    <span className="text-xs">No active boost packages available right now.</span>
                  </div>
                ) : (
                  packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const pkgCanAfford = currentCoins >= pkg.coinsCost;

                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => {
                          setSelectedPackageId(pkg.id);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer',
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/20 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900',
                          !pkgCanAfford && 'opacity-70'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                              isSelected
                                ? 'border-orange-600'
                                : 'border-zinc-400 dark:border-zinc-600'
                            )}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-orange-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                              {pkg.name}
                            </h4>
                            <p className="text-[11px] text-zinc-500">
                              Featured for {pkg.durationDays} Days across marketplace
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                            {pkg.coinsCost}
                          </span>
                          <span className="text-[10px] text-zinc-400 block -mt-1 font-medium">
                            coins
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Boost Notice Callout */}
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50 text-[11px] text-cyan-900 dark:text-cyan-200 leading-relaxed">
                ✨ Boosted listings and reels appear at the top of category searches and the reels feed with a Featured badge.
              </div>

              {/* Confirmation Details Card */}
              {selectedPackage && (
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Package:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedPackage.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Duration:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedPackage.durationDays} Days
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Package Cost:</span>
                    <span className="font-black text-orange-600 dark:text-orange-400">
                      {selectedPackage.coinsCost} Coins
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-700">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Estimated Remaining:
                    </span>
                    {canAfford ? (
                      <span className="font-bold text-emerald-600">
                        {currentCoins - selectedPackage.coinsCost} Coins
                      </span>
                    ) : (
                      <span className="font-bold text-red-600">
                        Insufficient (-{deficit} Coins)
                      </span>
                    )}
                  </div>

                  {/* Deficit Warning Box */}
                  {!canAfford && (
                    <div className="flex items-center gap-1.5 pt-2 text-red-600 text-[11px] font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        You need {deficit} more coins to activate this boost. Current balance: {currentCoins} coins.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirmBoost}
                disabled={!selectedPackage || !canAfford || isSubmitting}
                className={cn(
                  'w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98',
                  !selectedPackage || !canAfford || isSubmitting
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Boost...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      {!selectedPackage
                        ? 'Select a Package'
                        : !canAfford
                        ? `Insufficient Coins (Need ${deficit} More)`
                        : `Activate Boost for ${selectedPackage.coinsCost} Coins`}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const BoostModal: React.FC<BoostModalProps> = ({
  isOpen,
  onClose,
  target,
  onSuccess,
}) => {
  if (!isOpen || !target) return null;
  return (
    <BoostModalContent
      onClose={onClose}
      target={target}
      onSuccess={onSuccess}
    />
  );
};
