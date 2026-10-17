import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Film, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  Briefcase, 
  Wrench,
  User
} from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              O
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                OLX Clone
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 leading-tight">
                Video-First Market
              </span>
            </div>
          </Link>

          {/* Navigation links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              href="/reels"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Film className="w-4 h-4 text-rose-500" />
              <span>Reels</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-500" />
              <span>Search</span>
            </Link>
            <Link
              href="/categories/cars"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Categories</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Wrench className="w-4 h-4 text-cyan-500" />
              <span>Services</span>
            </Link>
          </nav>

          {/* Right Action Icons & Direct Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/chats"
              title="Chats & Messaging"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>
            <Link
              href="/favourites"
              title="Favourites"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </Link>
            <Link
              href="/profile/example-user"
              title="Profile"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Sell</span>
            </Link>
          </div>
        </div>

        {/* Secondary Navigation row for mobile */}
        <div className="lg:hidden flex items-center gap-3 py-2 border-t border-zinc-100 dark:border-zinc-800 text-xs overflow-x-auto whitespace-nowrap scrollbar-none text-zinc-600 dark:text-zinc-400">
          <Link href="/reels" className="hover:text-zinc-900 dark:hover:text-zinc-100">Reels</Link>
          <span>•</span>
          <Link href="/search" className="hover:text-zinc-900 dark:hover:text-zinc-100">Search</Link>
          <span>•</span>
          <Link href="/categories/cars" className="hover:text-zinc-900 dark:hover:text-zinc-100">Categories</Link>
          <span>•</span>
          <Link href="/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-100">Jobs</Link>
          <span>•</span>
          <Link href="/services" className="hover:text-zinc-900 dark:hover:text-zinc-100">Services</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100">Auth</Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-zinc-100 text-purple-600">Admin</Link>
        </div>
      </div>
    </header>
  );
};
