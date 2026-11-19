'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home, exact: true },
    { href: '/search', label: 'Explore', icon: Search },
    { href: '/sell', label: 'Sell', icon: Plus, isAction: true },
    { href: '/chats', label: 'Chats', icon: MessageSquare },
    { href: '/profile/example-user', label: 'Account', icon: User, matchPrefix: '/profile' },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] shadow-lg"
    >
      <div className="flex items-center justify-around h-15 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : item.matchPrefix
            ? pathname.startsWith(item.matchPrefix) || pathname === item.href
            : pathname.startsWith(item.href);

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
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
              key={item.href}
              href={item.href}
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
