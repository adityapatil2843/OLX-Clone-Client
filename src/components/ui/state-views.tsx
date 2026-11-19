'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  AlertCircle, 
  RotateCw, 
  Search, 
  Lock, 
  WifiOff, 
  Clock, 
  X, 
  ShieldAlert,
  ArrowRight,
  FileQuestion
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Normalizes any error object, status code, or message into user-friendly copy.
 * Strictly prevents leaking backend stack traces or internal implementation details.
 */
export function getFriendlyErrorMessage(error: unknown, status?: number): {
  title: string;
  description: string;
  isOffline: boolean;
  isAuth: boolean;
  isRateLimited: boolean;
  isNotFound: boolean;
} {
  // Offline or network disconnection
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      title: 'No Internet Connection',
      description: 'You appear to be offline. Please check your network connection and try again.',
      isOffline: true,
      isAuth: false,
      isRateLimited: false,
      isNotFound: false,
    };
  }

  const errMessage = error instanceof Error ? error.message : String(error || '');

  // 401 Unauthorized
  if (status === 401 || errMessage.toLowerCase().includes('unauthorized')) {
    return {
      title: 'Sign In Required',
      description: 'Please sign in to your Bazarr 360 account to access this feature.',
      isOffline: false,
      isAuth: true,
      isRateLimited: false,
      isNotFound: false,
    };
  }

  // 403 Forbidden
  if (status === 403 || errMessage.toLowerCase().includes('forbidden')) {
    return {
      title: 'Access Restricted',
      description: 'You do not have permission to view or modify this item.',
      isOffline: false,
      isAuth: true,
      isRateLimited: false,
      isNotFound: false,
    };
  }

  // 404 Not Found
  if (status === 404 || errMessage.toLowerCase().includes('not found')) {
    return {
      title: 'Item Not Found',
      description: 'The requested listing or product reel may have been removed or expired.',
      isOffline: false,
      isAuth: false,
      isRateLimited: false,
      isNotFound: true,
    };
  }

  // 422 Validation / Unprocessable Entity
  if (status === 422 || errMessage.toLowerCase().includes('validation') || errMessage.toLowerCase().includes('unprocessable')) {
    return {
      title: 'Invalid Filter Parameters',
      description: 'The search filters provided are invalid. Please verify your price range or search terms and try again.',
      isOffline: false,
      isAuth: false,
      isRateLimited: false,
      isNotFound: false,
    };
  }

  // 429 Rate Limit
  if (status === 429 || errMessage.toLowerCase().includes('too many requests')) {
    return {
      title: 'Too Many Requests',
      description: 'You are making requests too quickly. Please pause for a few seconds and try again.',
      isOffline: false,
      isAuth: false,
      isRateLimited: true,
      isNotFound: false,
    };
  }

  // Network Timeout / Connection Error
  if (errMessage.includes('Network Error') || errMessage.includes('ECONNREFUSED') || errMessage.includes('timeout')) {
    return {
      title: 'Connection Problem',
      description: 'Unable to reach the Bazarr 360 marketplace server. Please retry in a moment.',
      isOffline: true,
      isAuth: false,
      isRateLimited: false,
      isNotFound: false,
    };
  }

  // General 500 or fallback
  return {
    title: 'Something went wrong',
    description: 'We encountered an unexpected error while loading this content. Please try again.',
    isOffline: false,
    isAuth: false,
    isRateLimited: false,
    isNotFound: false,
  };
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  status?: number;
  error?: unknown;
  onRetry?: () => void | Promise<void>;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  status,
  error,
  onRetry,
  className = '',
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const friendly = getFriendlyErrorMessage(error, status);

  const displayTitle = title || friendly.title;
  const displayDesc = description || friendly.description;

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  let Icon = AlertCircle;
  if (friendly.isOffline) Icon = WifiOff;
  else if (friendly.isAuth) Icon = Lock;
  else if (friendly.isRateLimited) Icon = Clock;
  else if (friendly.isNotFound) Icon = FileQuestion;

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/60 dark:bg-rose-950/20 p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {onRetry && (
        <Button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm py-2 px-5 rounded-xl shadow-xs inline-flex items-center gap-2 active:scale-95 transition-all"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
        </Button>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionHref,
  actionLabel,
  icon: Icon = Search,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3.5 max-w-md mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
          {description}
        </p>
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};

/**
 * Skeleton Grid for Marketplace Listings matching 2-col mobile & 4-col desktop
 */
export const ListingSkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs animate-pulse"
        >
          <div className="aspect-4/3 sm:aspect-16/10 bg-zinc-200 dark:bg-zinc-800 w-full" />
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-2/3" />
            <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2 pt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Unauthenticated Protected Action Prompt Dialog
 * Displayed when user tries to favourite, chat, or post without logging in.
 * Preserves public browsing and never forces navigation away.
 */
export interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  returnUrl?: string;
  redirectPath?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  title = 'Sign In to Continue',
  description = 'To save favourites, message sellers, or post ads on Bazarr 360, please sign in to your free account.',
  returnUrl = '/',
  redirectPath,
}) => {
  const destination = returnUrl !== '/' ? returnUrl : (redirectPath || '/');
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 id="auth-prompt-title" className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(destination)}`}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            Sign In with Email
          </Link>

          <Link
            href={`/register?redirect=${encodeURIComponent(destination)}`}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm text-center flex items-center justify-center transition-all"
          >
            Create Free Account
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
