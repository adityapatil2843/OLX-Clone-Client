import * as React from 'react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actionTitle?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  title,
  description,
  actionTitle,
  actionHref,
  onAction,
  icon,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30',
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {actionTitle && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="default" size="default" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                {actionTitle}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onAction}
              variant="default"
              size="default"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            >
              {actionTitle}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
