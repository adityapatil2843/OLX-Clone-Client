'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReelCard } from './ReelCard';
import { ReelItem } from '@/types/reel';
import { cn } from '@/lib/utils';

export const ReelsFeed: React.FC<{ reels: ReelItem[] }> = ({ reels }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const move = React.useCallback(
    (direction: -1 | 1) => {
      const nextIndex = Math.min(reels.length - 1, Math.max(0, activeIndex + direction));
      setActiveIndex(nextIndex);
      itemRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [activeIndex, reels.length]
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        move(-1);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        move(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  // Centralized IntersectionObserver for active reel in feed
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const visibleRatios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = itemRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) {
            visibleRatios.set(index, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        });

        let bestIndex = -1;
        let maxRatio = 0.5;
        visibleRatios.forEach((ratio, index) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestIndex = index;
          }
        });

        if (bestIndex !== -1) {
          setActiveIndex(bestIndex);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels.length]);

  return (
    <section className="relative mx-auto flex min-h-screen w-full items-center justify-center px-2 py-4 md:px-8">
      {/* Vertical Reels Feed Container */}
      <div className="flex w-full max-w-4xl flex-col items-center gap-12 snap-y snap-mandatory overflow-y-auto">
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={cn(
              'flex min-h-[calc(100vh-2rem)] w-full snap-center items-center justify-center transition-opacity duration-300',
              index === activeIndex ? 'opacity-100' : 'opacity-70'
            )}
          >
            <ReelCard
              reel={reel}
              isFeedMode={true}
              priority={index === activeIndex}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>

      {/* Far Right: Separate Previous/Up and Next/Down Reel Controls */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous reel"
          title="Previous reel"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 border border-zinc-800 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={activeIndex === reels.length - 1}
          aria-label="Next reel"
          title="Next reel"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/90 border border-zinc-800 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};
