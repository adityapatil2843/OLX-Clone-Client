import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Briefcase, 
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
  title: 'Jobs & Employment in India - Coming Soon | Bazarr 360',
  description: 'Bazarr 360 Jobs & Employment portal is under development. Verified recruiter postings, resume applications, and salary transparency features coming soon.',
  alternates: {
    canonical: `${env.appUrl}/jobs`,
  },
  openGraph: {
    title: 'Jobs & Employment in India - Coming Soon | Bazarr 360',
    description: 'Bazarr 360 Jobs & Employment portal is under development. Verified recruiter postings, resume applications, and salary transparency features coming soon.',
    url: `${env.appUrl}/jobs`,
    siteName: env.appName,
    images: [{ url: `${env.appUrl}/images/logo-1.png`, width: 800, height: 800, alt: 'Jobs & Employment on Bazarr 360' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Jobs & Employment in India - Coming Soon | Bazarr 360',
    description: 'Bazarr 360 Jobs portal is in development. No fake listings or simulated applications.',
  },
};

const PLANNED_JOB_CATEGORIES = [
  { name: 'Data Entry & Back Office', count: 'Phase 2' },
  { name: 'Sales & Marketing', count: 'Phase 2' },
  { name: 'BPO & Telecalling', count: 'Phase 2' },
  { name: 'Drivers & Chauffeurs', count: 'Phase 2' },
  { name: 'Office Assistants', count: 'Phase 2' },
  { name: 'Delivery & Logistics', count: 'Phase 2' },
  { name: 'Teachers & Tutors', count: 'Phase 2' },
  { name: 'Cooks & Domestic Staff', count: 'Phase 2' },
];

export default function JobsPage() {
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
          Jobs & Employment
        </span>
      </nav>

      {/* ── Hero Status Banner ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-10 border border-zinc-800 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Deferred Feature State
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
            <Clock className="w-3 h-3 text-zinc-400" />
            Phase 2 Backend Dependency
          </span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Jobs & Hiring Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Under Active Development</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            We are engineering a secure recruitment and candidate portal. In adherence to our zero-tolerance policy against fake listings, simulated applicant forms, and unverified contacts are strictly disabled until full backend API contracts are ready.
          </p>
        </div>
      </div>

      {/* ── Honest Status & Architectural Disclosure Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base sm:text-lg">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <h2>Why is this section currently in a deferred state?</h2>
          </div>
          <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-3 leading-relaxed">
            <p>
              The current Bazarr 360 backend specializes in peer-to-peer physical marketplace listings. A dedicated employment portal requires specialized backend infrastructure:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Recruiter Identity Verification:</strong> Verified company registrations to protect job seekers from advance-fee employment scams.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Encrypted Resume Vault:</strong> Secure candidate resume storage with signed, temporary download access for employers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Direct Applicant Pipeline:</strong> Application tracking system (ATS) endpoints for shortlisting and hiring status updates.</span>
              </li>
            </ul>
            <p className="pt-2 text-zinc-500 italic text-xs">
              Rather than presenting mock job postings or non-functional &quot;Apply&quot; buttons, we maintain platform honesty by deferring candidate actions until these secure APIs are deployed.
            </p>
          </div>
        </div>

        {/* ── What You Can Do Today Card ── */}
        <div className="rounded-2xl border border-orange-200 dark:border-orange-950/60 bg-gradient-to-b from-orange-50/50 to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
              <Sparkles className="w-4 h-4" />
              <span>Available Today</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Hiring or Looking for Work?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Employers can post general employment classifieds under the active marketplace catalog, and seekers can explore listings directly.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-orange-200/60 dark:border-zinc-800">
            <Link
              href="/sell"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Classified Ad</span>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Planned Categories Grid ── */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <span>Taxonomy Roadmap: Upcoming Job Roles</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verified categories mapped in the database taxonomy awaiting Phase 2 application pipelines.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 self-start sm:self-auto px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
            8 Roles Defined
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANNED_JOB_CATEGORIES.map((role) => (
            <div
              key={role.name}
              className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1.5"
            >
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block truncate">
                {role.name}
              </span>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Clock className="w-2.5 h-2.5" />
                  {role.count}
                </span>
                <span>Direct Apply Pending</span>
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
            href="/categories/properties"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Properties</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>Local Services Status</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
