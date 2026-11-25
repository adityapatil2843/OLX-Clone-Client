'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bookmark, Coins, Sparkles, LogOut, HelpCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationItems, isItemActive, resolveNavItemHref } from './navigation';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);
  const moreRef = React.useRef<HTMLDivElement>(null);

  // Close more menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreOpen]);

  return (
    <aside className="group fixed inset-y-0 left-0 z-50 hidden w-[72px] border-r border-zinc-800 bg-black text-white transition-[width] duration-300 hover:w-60 focus-within:w-60 md:block hover:shadow-2xl hover:shadow-black focus-within:shadow-2xl">
      <div className="flex h-full flex-col justify-between overflow-hidden px-3 py-5">
        <div className="flex flex-col gap-4">
          {/* Top Logo - Clicking reloads the current page */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
            aria-label="Refresh Bazarr 360"
            title="Refresh current page"
            className="flex h-11 w-full items-center gap-4 rounded-xl px-2 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-500/30">
              <Image
                src="/images/logo-1.png"
                alt="Bazarr 360"
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-base font-black tracking-tight text-white opacity-0 transition-all duration-300 group-hover:max-w-[150px] group-hover:opacity-100 group-focus-within:max-w-[150px] group-focus-within:opacity-100">
              Bazarr <span className="text-orange-500">360</span>
            </span>
          </button>

          {/* Navigation Items */}
          <nav aria-label="Primary navigation" className="mt-2 flex flex-col gap-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(pathname, item);
              const targetHref = resolveNavItemHref(item, user, isAuthenticated);

              return (
                <Link
                  key={item.label}
                  href={targetHref}
                  aria-current={active ? 'page' : undefined}
                  title={item.label}
                  className={cn(
                    'flex h-11 items-center gap-4 rounded-xl px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                    active
                      ? 'bg-white/10 font-bold text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className={cn('h-6 w-6 shrink-0 transition-transform', active && 'stroke-[2.5] scale-105 text-orange-400')} />
                  <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 group-hover:max-w-[150px] group-hover:opacity-100 group-focus-within:max-w-[150px] group-focus-within:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom More Menu */}
        <div ref={moreRef} className="relative">
          {isMoreOpen && (
            <div className="absolute bottom-14 left-0 z-50 w-56 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-md animate-fade-in text-xs font-semibold text-zinc-300">
              <Link
                href="/favourites"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Saved Favourites</span>
              </Link>
              <Link
                href="/wallet"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Wallet & Coins</span>
              </Link>
              <Link
                href="/boosted-content"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Boosted Reels</span>
              </Link>
              <div className="my-1 border-t border-zinc-800" />
              <Link
                href="/contact-us"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>Help &amp; Support</span>
              </Link>
              <Link
                href="/terms-and-conditions"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Legal &amp; Policies</span>
              </Link>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMoreOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            aria-label="More options"
            title="More"
            className={cn(
              'flex h-11 w-full items-center gap-4 rounded-xl px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
              isMoreOpen
                ? 'bg-white/10 text-white font-bold'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <Menu className="h-6 w-6 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 group-hover:max-w-[150px] group-hover:opacity-100 group-focus-within:max-w-[150px] group-focus-within:opacity-100">
              More
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
