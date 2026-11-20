import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Video, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Popular Categories */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Popular Categories
            </h5>
            <ul className="space-y-2">
              <li><Link href="/categories/vehicles" className="hover:text-orange-600 transition-colors">Cars & Motorbikes</Link></li>
              <li><Link href="/categories/mobiles" className="hover:text-orange-600 transition-colors">Mobile Phones & Tablets</Link></li>
              <li><Link href="/categories/electronics" className="hover:text-orange-600 transition-colors">Laptops & Electronics</Link></li>
              <li><Link href="/categories/properties" className="hover:text-orange-600 transition-colors">Flats & Houses for Sale</Link></li>
              <li><Link href="/categories/furniture" className="hover:text-orange-600 transition-colors">Home & Office Furniture</Link></li>
            </ul>
          </div>

          {/* Popular Cities in India */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Popular Locations
            </h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Mumbai" className="hover:text-orange-600 transition-colors">Mumbai, Maharashtra</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Delhi" className="hover:text-orange-600 transition-colors">Delhi NCR</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Bangalore" className="hover:text-orange-600 transition-colors">Bangalore, Karnataka</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Hyderabad" className="hover:text-orange-600 transition-colors">Hyderabad, Telangana</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Pune" className="hover:text-orange-600 transition-colors">Pune, Maharashtra</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-orange-600" /><Link href="/search?city=Chennai" className="hover:text-orange-600 transition-colors">Chennai, Tamil Nadu</Link></li>
            </ul>
          </div>

          {/* Marketplace Features */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Marketplace Features
            </h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Video className="w-3 h-3 text-rose-500" /><Link href="/reels" className="hover:text-orange-600 transition-colors">Short Product Video Reels</Link></li>
              <li><Link href="/sell" className="hover:text-orange-600 transition-colors">Sell Fast in 60 Seconds</Link></li>
              <li><Link href="/search" className="hover:text-orange-600 transition-colors">Search & Filters</Link></li>
              <li><Link href="/chats" className="hover:text-orange-600 transition-colors">Buyer–Seller Direct Chat</Link></li>
              <li><Link href="/favourites" className="hover:text-orange-600 transition-colors">Saved Watchlist</Link></li>
              <li><Link href="/profile/example-user" className="hover:text-orange-600 transition-colors">Seller Profile</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-3">
              Trust & Safety
            </h5>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buyer Safety Rules</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                Always meet sellers in safe public places. Inspect products thoroughly in person before making payments.
              </p>
              <p className="text-orange-600 dark:text-orange-400 font-semibold">
                Never send advance token payments.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 Bazarr 360 - Free Video-First Marketplace for India</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Phase 3 Launch Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
