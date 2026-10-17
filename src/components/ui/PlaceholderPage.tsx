import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Code2, 
  ExternalLink, 
  Layers, 
  LockOpen, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PlaceholderPageProps } from '@/types';

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  category,
  routePath,
  params,
  plannedFeatures,
  quickLinks,
}) => {
  const categoryBadgeStyles = {
    public: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    auth: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    account: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    admin: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
  }[category];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Top Breadcrumb / Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Phase 0 Directory
        </Link>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${categoryBadgeStyles}`}>
            {category} route
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Phase 0 Placeholder
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
        {/* Title and Description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <Code2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>Path: {routePath}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>

          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Dynamic Route Parameters Display */}
        {params && Object.keys(params).length > 0 && (
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic Route Parameters Resolved
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(params).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded bg-white/80 dark:bg-zinc-900/80 border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-mono text-xs text-zinc-500">[{key}]</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase 0 Development Status Notice */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 flex items-start gap-3">
          <LockOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-semibold">Direct Access Enabled (Phase 0 Testing Mode)</p>
            <p className="text-emerald-700 dark:text-emerald-300">
              This route is open without authentication guards, login redirects, or backend session requirements. This unrestricted visibility is by design during Phase 0 for structure verification.
            </p>
          </div>
        </div>

        {/* Planned Features List (Clearly marked as future) */}
        {plannedFeatures && plannedFeatures.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span>Target Capabilities (Planned for Subsequent Phases)</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {plannedFeatures.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs md:text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Route Links */}
        {quickLinks && quickLinks.length > 0 && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Related Test Routes
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
