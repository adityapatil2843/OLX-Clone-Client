'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { bottomNavItems, isItemActive, resolveNavItemHref } from './navigation';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] shadow-lg"
    >
      <div className="flex items-center justify-around h-15 px-2 max-w-lg mx-auto">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(pathname, item);
          const targetHref = resolveNavItemHref(item, user, isAuthenticated);

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                href={targetHref}
                className="flex flex-col items-center justify-center -mt-5 group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg group-active:scale-95 transition-transform border-3 border-white dark:border-zinc-950">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={targetHref}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors focus:outline-none',
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'stroke-[2.5] scale-105')} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
