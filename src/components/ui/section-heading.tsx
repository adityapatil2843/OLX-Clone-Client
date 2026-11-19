import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  badge?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  title,
  subtitle,
  actionHref,
  actionLabel,
  badge,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-end justify-between gap-4 mb-4 sm:mb-6', className)}
      {...props}
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:underline shrink-0 pb-0.5"
        >
          <span>{actionLabel || 'See all'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
