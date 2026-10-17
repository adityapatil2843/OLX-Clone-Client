import React from 'react';
import Link from 'next/link';
import { 
  Film, 
  Search, 
  ShoppingBag, 
  Briefcase, 
  Wrench, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  User, 
  ShieldCheck, 
  Users, 
  FolderTree, 
  AlertOctagon, 
  CheckCircle, 
  FileText, 
  ArrowRight,
  Layers,
  Sparkles,
  LockOpen
} from 'lucide-react';

export default function HomePage() {
  const routeSections = [
    {
      title: '1. Public Routes',
      badge: 'Public Access',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
      description: 'Core discovery, video feed, catalog navigation, and business storefronts.',
      routes: [
        { href: '/', label: 'Home / Route Directory', path: '/', icon: ShoppingBag, note: 'Current root index' },
        { href: '/reels', label: 'Video Reels Feed', path: '/reels', icon: Film, note: 'Short-form video discovery' },
        { href: '/search', label: 'Marketplace Search', path: '/search', icon: Search, note: 'Listing search & filtering' },
        { href: '/categories/cars', label: 'Category Page', path: '/categories/[slug]', icon: FolderTree, note: 'Example: /categories/cars' },
        { href: '/listing/123', label: 'Listing Details', path: '/listing/[id]', icon: ShoppingBag, note: 'Example: /listing/123' },
        { href: '/business/example-store', label: 'Business Profile', path: '/business/[slug]', icon: Briefcase, note: 'Example: /business/example-store' },
        { href: '/jobs', label: 'Jobs Board', path: '/jobs', icon: Briefcase, note: 'Employment opportunities' },
        { href: '/services', label: 'Services Directory', path: '/services', icon: Wrench, note: 'Local service providers' },
      ],
    },
    {
      title: '2. Authentication Routes',
      badge: 'Auth Placeholders',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
      description: 'Sign-in and onboarding routes. Note: In Phase 0, no login is required anywhere.',
      routes: [
        { href: '/login', label: 'User Sign In', path: '/login', icon: LogIn, note: 'Credential & phone sign in' },
        { href: '/register', label: 'Create Account', path: '/register', icon: UserPlus, note: 'New user onboarding' },
        { href: '/verify-otp', label: 'Verify OTP', path: '/verify-otp', icon: KeyRound, note: 'SMS / OTP verification' },
      ],
    },
    {
      title: '3. Account Routes',
      badge: 'Direct Dev Access',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
      description: 'Seller workflow, communications, and personal settings. Accessible directly without sign-in.',
      routes: [
        { href: '/sell', label: 'Post an Ad / Sell', path: '/sell', icon: PlusCircle, note: 'Listing creation flow' },
        { href: '/chats', label: 'Buyer–Seller Chats', path: '/chats', icon: MessageSquare, note: 'Direct conversations' },
        { href: '/favourites', label: 'Saved Favourites', path: '/favourites', icon: Heart, note: 'Bookmarked listings' },
        { href: '/profile/example-user', label: 'User Profile', path: '/profile/[id]', icon: User, note: 'Example: /profile/example-user' },
      ],
    },
    {
      title: '4. Admin Console Routes',
      badge: 'Admin Placeholders',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
      description: 'Operational and moderation control panels. Open directly for Phase 0 layout verification.',
      routes: [
        { href: '/admin', label: 'Admin Overview', path: '/admin', icon: ShieldCheck, note: 'Platform health & metrics' },
        { href: '/admin/users', label: 'Users Management', path: '/admin/users', icon: Users, note: 'Account statuses & roles' },
        { href: '/admin/listings', label: 'Listings Moderation', path: '/admin/listings', icon: ShoppingBag, note: 'Ad approval & review' },
        { href: '/admin/reels', label: 'Reels Moderation', path: '/admin/reels', icon: Film, note: 'Video review queue' },
        { href: '/admin/reports', label: 'User Reports', path: '/admin/reports', icon: AlertOctagon, note: 'Disputes & flagged items' },
        { href: '/admin/categories', label: 'Categories Taxonomy', path: '/admin/categories', icon: FolderTree, note: 'Category management' },
        { href: '/admin/verification', label: 'Seller Verification', path: '/admin/verification', icon: CheckCircle, note: 'KYC & dealer badges' },
        { href: '/admin/audit-logs', label: 'System Audit Logs', path: '/admin/audit-logs', icon: FileText, note: 'Operational activity trail' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Hero / Phase Notice */}
      <div className="bg-gradient-to-br from-indigo-900 via-zinc-900 to-black text-white rounded-3xl p-6 md:p-10 border border-indigo-950/60 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 0: Client Foundation & Route Visibility
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Next.js App Router • TypeScript
          </span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            OLX Clone Client
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Video-first marketplace client structure for India. Every planned page in the system is directly accessible below with no authentication gates or backend requirements.
          </p>
        </div>

        {/* Phase 0 Guarantees Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <LockOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Unrestricted Access</span>
              <span className="text-zinc-400">All public, account, and admin routes render directly.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Layers className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-white block">App Router Route Groups</span>
              <span className="text-zinc-400">(public), (auth), (account) clean URLs.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Dynamic Routes</span>
              <span className="text-zinc-400">Categories, listings, business, and profile slugs.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Sections */}
      <div className="space-y-10">
        {routeSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  {section.description}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${section.badgeColor}`}>
                {section.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.routes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group relative flex flex-col justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/50 hover:shadow-md transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {route.path}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {route.label}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {route.note}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <span>Open route</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
