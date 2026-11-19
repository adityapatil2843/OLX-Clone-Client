import * as React from 'react';
import { ListingItem } from '@/types/listing';
import { ListingCard } from './ListingCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export interface ListingGridProps {
  listings: ListingItem[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
  listings,
  isLoading = false,
  emptyTitle = 'No listings found',
  emptyDescription = 'There are no active listings matching your selection. Try adjusting your search or filters.',
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5',
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 sm:p-3 space-y-2.5"
          >
            <Skeleton className="aspect-4/3 w-full rounded-lg" />
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="pt-2 flex justify-between">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionTitle="Browse All Listings"
        actionHref="/search"
      />
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5',
        className
      )}
    >
      {listings.map((item, idx) => (
        <ListingCard key={item.id} listing={item} priority={idx < 4} />
      ))}
    </div>
  );
};
