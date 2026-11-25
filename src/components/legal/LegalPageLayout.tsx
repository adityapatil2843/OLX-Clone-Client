import * as React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/page-container';
import { Shield, FileText, RefreshCw, Cookie, Mail, UserX, MapPin, Calendar, ExternalLink } from 'lucide-react';

export interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated?: string;
  activeRoute: '/privacy-policy' | '/terms-and-conditions' | '/refund-policy' | '/cookie-policy' | '/contact-us' | '/delete-account';
  children: React.ReactNode;
}

const LEGAL_NAV_ITEMS = [
  { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
  { href: '/terms-and-conditions', label: 'Terms & Conditions', icon: FileText },
  { href: '/refund-policy', label: 'Refund Policy', icon: RefreshCw },
  { href: '/cookie-policy', label: 'Cookie Policy', icon: Cookie },
  { href: '/delete-account', label: 'Delete Account', icon: UserX },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
];

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  description,
  lastUpdated = 'November 2026',
  activeRoute,
  children,
}) => {
  return (
    <PageContainer size="narrow" className="py-6 sm:py-10">
      {/* Breadcrumb / Top Tag */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-4">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Bazarr360
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-bold">Legal & Policies</span>
      </div>

      {/* Header Banner */}
      <header className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
            Bazarr360 Official
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            Last Updated: {lastUpdated}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            Pune, Maharashtra, India
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {description}
        </p>

        {/* Quick Nav Pills */}
        <nav
          aria-label="Legal policies navigation"
          className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none"
        >
          {LEGAL_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Legal Content Article */}
      <article className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </article>

      {/* Legal Disclaimer & Review Note */}
      <div className="mt-12 p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
        <p className="font-bold text-zinc-700 dark:text-zinc-300">
          Platform Transparency Notice & Legal Review Placeholder
        </p>
        <p>
          The information presented on this page describes the current operational features and data practices of Bazarr360 (Pune, Maharashtra, India). This document does not constitute formal legal counsel and is provided for user clarity and platform transparency. This policy is subject to ongoing review and formal refinement by our legal compliance team.
        </p>
        <p>
          For questions, formal legal notices, or compliance inquiries, please write to{' '}
          <a
            href="mailto:support@bazarr360.in"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            support@bazarr360.in
          </a>
          .
        </p>
      </div>
    </PageContainer>
  );
};
