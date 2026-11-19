import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Wrench, 
  Clock, 
  ArrowRight, 
  Search, 
  PlusCircle, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Local Services Directory in India - Coming Soon | Bazarr 360',
  description: 'Bazarr 360 Local Services directory is under active development. Verified service professionals, transparent pricing, and direct quote requests coming soon.',
  alternates: {
    canonical: `${env.appUrl}/services`,
  },
  openGraph: {
    title: 'Local Services Directory in India - Coming Soon | Bazarr 360',
    description: 'Bazarr 360 Local Services directory is under active development. Verified service professionals, transparent pricing, and direct quote requests coming soon.',
    url: `${env.appUrl}/services`,
    siteName: env.appName,
    images: [{ url: `${env.appUrl}/images/logo-1.png`, width: 800, height: 800, alt: 'Local Services on Bazarr 360' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Local Services Directory in India - Coming Soon | Bazarr 360',
    description: 'Bazarr 360 Services portal is in development. No fake providers or simulated booking.',
  },
};

const PLANNED_SERVICE_CATEGORIES = [
  { name: 'Electronics & Appliance Repair', count: 'Phase 2' },
  { name: 'Home Renovation & Painting', count: 'Phase 2' },
  { name: 'Education & Home Tutors', count: 'Phase 2' },
  { name: 'Health & Beauty at Home', count: 'Phase 2' },
  { name: 'Travel, Tour & Taxi Services', count: 'Phase 2' },
  { name: 'Packers & Movers Logistics', count: 'Phase 2' },
  { name: 'Carpentry & Plumbing', count: 'Phase 2' },
  { name: 'Event Management & Catering', count: 'Phase 2' },
];

export default function ServicesPage() {
  return (
    <PageContainer className="space-y-6 sm:space-y-8 pb-24 md:pb-16 max-w-5xl">
      {/* ── Breadcrumb Navigation ── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 md:hidden" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <span className="text-zinc-900 dark:text-zinc-100 font-bold">
          Local Services
        </span>
      </nav>

      {/* ── Hero Status Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-10 border border-zinc-800 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Deferred Feature State
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
            <Clock className="w-3 h-3 text-zinc-400" />
            Phase 2 Backend Dependency
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Local Services Directory <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Under Active Development</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            We are building a trusted local service provider directory with verified background checks and quote dispatch. In accordance with platform integrity rules, simulated service ratings, fake provider cards, and dummy booking forms are strictly disabled until full backend APIs are deployed.
          </p>
        </div>
      </div>

      {/* ── Honest Status & Architectural Disclosure Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base sm:text-lg">
            <AlertCircle className="w-5 h-5 text-cyan-600 shrink-0" />
            <h2>Why is this section currently in a deferred state?</h2>
          </div>
          <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-3 leading-relaxed">
            <p>
              Professional services require dedicated transactional models that differ substantially from physical product classifieds:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Provider Verification & KYC:</strong> Aadhaar and trade license validation to ensure consumer safety during in-home repairs and services.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Quote Request & Dispatch Engine:</strong> Structured endpoints for customers to describe tasks, upload photos, and receive competitive bids.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Verified Customer Reviews:</strong> Transaction-bound rating systems preventing fake testimonials and review manipulation.</span>
              </li>
            </ul>
            <p className="pt-2 text-zinc-500 italic text-xs">
              No simulated ratings, placeholder service portfolios, or non-functional booking modals are rendered. Production honesty is preserved until full Phase 2 backend support is live.
            </p>
          </div>
        </div>

        {/* ── What You Can Do Today Card ── */}
        <div className="rounded-2xl border border-cyan-200 dark:border-cyan-950/60 bg-gradient-to-b from-cyan-50/50 to-teal-50/30 dark:from-zinc-900 dark:to-zinc-900 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Available Today</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Offering or Need a Service?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Professionals can publish classified service listings directly under the live marketplace, and customers can discover them via search.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-cyan-200/60 dark:border-zinc-800">
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Service Ad</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Search Marketplace</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Planned Service Categories Grid ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-600" />
              <span>Taxonomy Roadmap: Upcoming Service Categories</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Service categories mapped in the database taxonomy scheduled for Phase 2 dispatch integration.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 self-start sm:self-auto px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
            8 Services Defined
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANNED_SERVICE_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1.5"
            >
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block truncate">
                {cat.name}
              </span>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-medium">
                  <Clock className="w-2.5 h-2.5" />
                  {cat.count}
                </span>
                <span>Booking Flow Pending</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Active Categories Navigation ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Browse Live Verified Marketplace Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/categories/vehicles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Cars & Bikes</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
          <Link
            href="/categories/mobiles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Mobile Phones</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
          <Link
            href="/categories/electronics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Electronics & Appliances</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Jobs Portal Status</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
          <Link
            href="/categories/properties"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Properties</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
