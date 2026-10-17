import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">Public Routes</h5>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/reels" className="hover:underline">Reels</Link></li>
              <li><Link href="/search" className="hover:underline">Search</Link></li>
              <li><Link href="/categories/cars" className="hover:underline">Category: Cars</Link></li>
              <li><Link href="/listing/123" className="hover:underline">Listing #123</Link></li>
              <li><Link href="/business/example-store" className="hover:underline">Business Store</Link></li>
              <li><Link href="/jobs" className="hover:underline">Jobs</Link></li>
              <li><Link href="/services" className="hover:underline">Services</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">Auth Placeholders</h5>
            <ul className="space-y-1">
              <li><Link href="/login" className="hover:underline">Login</Link></li>
              <li><Link href="/register" className="hover:underline">Register</Link></li>
              <li><Link href="/verify-otp" className="hover:underline">Verify OTP</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">Account Placeholders</h5>
            <ul className="space-y-1">
              <li><Link href="/sell" className="hover:underline">Sell / Post Ad</Link></li>
              <li><Link href="/chats" className="hover:underline">Chats</Link></li>
              <li><Link href="/favourites" className="hover:underline">Favourites</Link></li>
              <li><Link href="/profile/example-user" className="hover:underline">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">Admin Console</h5>
            <ul className="space-y-1">
              <li><Link href="/admin" className="hover:underline">Dashboard</Link></li>
              <li><Link href="/admin/users" className="hover:underline">Users</Link></li>
              <li><Link href="/admin/listings" className="hover:underline">Listings</Link></li>
              <li><Link href="/admin/reels" className="hover:underline">Reels</Link></li>
              <li><Link href="/admin/reports" className="hover:underline">Reports</Link></li>
              <li><Link href="/admin/categories" className="hover:underline">Categories</Link></li>
              <li><Link href="/admin/verification" className="hover:underline">Verification</Link></li>
              <li><Link href="/admin/audit-logs" className="hover:underline">Audit Logs</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© 2026 OLX Clone (Video-First Marketplace) • Phase 0 Active</p>
          <p className="flex items-center gap-2">
            <span>Target Launch: 5 Nov 2026</span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Development Mode (No Auth Restrictions)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
