import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryTitle?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className,
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  retryTitle = 'Try Again',
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-rose-200 dark:border-rose-950/50 bg-rose-50/30 dark:bg-rose-950/10',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {message && (
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
          {message}
        </p>
      )}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="default"
          className="mt-5 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          {retryTitle}
        </Button>
      )}
    </div>
  );
};
