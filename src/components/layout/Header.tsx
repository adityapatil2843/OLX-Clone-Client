'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Film, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  User,
  MapPin,
  ChevronDown,
  Bell,
  Coins,
  LogOut
} from 'lucide-react';
import { LocationSelectorModal } from '@/components/location/LocationSelectorModal';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [selectedCity, setSelectedCity] = React.useState('All India');
  const [selectedState, setSelectedState] = React.useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLocationSelect = (loc: { city?: string; state?: string }) => {
    const city = loc.city || 'All India';
    const state = loc.state || '';
    setSelectedCity(city);
    setSelectedState(state);

    const params = new URLSearchParams();
    if (city !== 'All India') params.set('city', city);
    if (state) params.set('state', state);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCity !== 'All India') params.set('city', selectedCity);
    if (selectedState) params.set('state', selectedState);

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
      {/* ── MOBILE TOP BAR (320px - 767px) ── */}
      <div className="md:hidden flex items-center justify-between h-14 px-3 sm:px-4 gap-2">
        {/* Brand with Official Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-xs border border-orange-500/20">
            <Image
              src="/images/logo-1.png"
              alt="Bazarr 360 Logo"
              width={32}
              height={32}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              Bazarr <span className="text-orange-600 dark:text-orange-400">360</span>
            </span>
            <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase leading-tight mt-0.5">
              INDIA
            </span>
          </div>
        </Link>

        {/* Mobile City / Location Quick Pill */}
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          aria-label={`Browsing location: ${selectedCity}${selectedState ? `, ${selectedState}` : ''}. Click to change.`}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 max-w-[130px] active:scale-95 transition-transform"
        >
          <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
          <span className="truncate text-[11px] font-medium">{selectedCity}</span>
          <ChevronDown className="w-2.5 h-2.5 text-zinc-400 shrink-0 pointer-events-none" />
        </button>

        {/* Mobile Action Shortcuts */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href="/search"
            aria-label="Search Marketplace"
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
          </Link>
          <Link
            href="/wallet"
            aria-label="Wallet and Coins"
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Coins className="w-4 h-4 text-amber-500" />
          </Link>
          <Link
            href="/favourites"
            aria-label="Saved Favourites"
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-rose-500 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </Link>
          {isAuthenticated ? (
            <Link
              href={`/profile/${user?.id || 'me'}`}
              aria-label="User Account"
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <User className="w-4 h-4 text-orange-600" />
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Sign In"
              className="p-1 px-2 text-[11px] font-bold text-orange-600 rounded-lg bg-orange-50 dark:bg-orange-950/40"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* ── DESKTOP & TABLET HEADER (768px+) ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-xs border border-orange-500/20 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-1.png"
                alt="Bazarr 360 Logo"
                width={40}
                height={40}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Bazarr <span className="text-orange-600 dark:text-orange-400">360</span>
              </span>
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase leading-tight mt-0.5">
                India Video Market
              </span>
            </div>
          </Link>

          {/* Location Selector Pill */}
          <div className="relative flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label={`Current location: ${selectedCity}${selectedState ? `, ${selectedState}` : ''}. Click to select state or city.`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-orange-500 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span className="truncate max-w-[140px] font-medium">
                {selectedCity}{selectedState ? `, ${selectedState}` : ''}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400 pointer-events-none" />
            </button>
          </div>

          {/* Search Bar on Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md flex items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search listings, categories and reels"
              placeholder="Find Cars, Mobile Phones, Electronics, Flats..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-orange-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Right Action Icons & Direct Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/reels"
              title="Watch Video Reels"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Film className="w-4 h-4" />
              <span>Reels</span>
            </Link>

            <Link
              href="/chats"
              title="Chats & Messaging"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="sr-only">Chats</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600" />
            </Link>

            <Link
              href="/notifications"
              title="Notifications"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="sr-only">Notifications</span>
            </Link>

            <Link
              href="/favourites"
              title="Favourites / Saved"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="sr-only">Favourites</span>
            </Link>

            <Link
              href="/wallet"
              title="Wallet & Coins"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Wallet</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link
                  href={`/profile/${user?.id || 'me'}`}
                  title={user?.name ? `${user.name}'s Profile` : 'User Account'}
                  className="flex items-center gap-1.5 p-1.5 px-2.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs font-bold"
                >
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span className="truncate max-w-[80px]">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="p-1.5 text-zinc-500 hover:text-rose-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 text-zinc-800 dark:text-zinc-200 hover:text-orange-600 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Sell Action Button */}
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Sell</span>
            </Link>
          </div>
        </div>

        {/* Secondary Category Subnav - Desktop */}
        <div className="flex items-center gap-5 py-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-semibold text-zinc-600 dark:text-zinc-400 overflow-x-auto">
          <Link href="/categories/vehicles" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1">
            <span>Cars & Bikes</span>
          </Link>
          <Link href="/categories/mobiles" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Mobiles
          </Link>
          <Link href="/categories/electronics" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Electronics
          </Link>
          <Link href="/categories/properties" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Properties
          </Link>
          <Link href="/categories/furniture" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            Furniture
          </Link>
          <div className="ml-auto flex items-center gap-1 text-[11px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Bazarr 360 India</span>
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={selectedCity}
        selectedState={selectedState}
        onSelectLocation={handleLocationSelect}
      />
    </header>
  );
};
