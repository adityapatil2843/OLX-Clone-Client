import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { RefreshCw, Info, AlertCircle, Coins, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy - Bazarr360 India',
  description:
    'Information regarding refund, return, and cancellation policies on Bazarr360 video marketplace.',
  alternates: {
    canonical: 'https://www.bazarr360.in/refund-policy',
  },
  openGraph: {
    title: 'Refund & Cancellation Policy - Bazarr360',
    description: 'Read the refund and cancellation policy of Bazarr360 marketplace.',
    url: 'https://www.bazarr360.in/refund-policy',
    siteName: 'Bazarr360',
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      description="Clear information regarding financial transactions, cancellations, and refund applicability on the Bazarr360 platform."
      lastUpdated="November 2026"
      activeRoute="/refund-policy"
    >
      {/* Primary Policy Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border-2 border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20 not-prose mb-8">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Current Operating Status &amp; Financial Scope
            </h3>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
              &ldquo;Bazarr360 currently does not offer paid subscriptions, paid wallet/coin purchases, or paid marketplace transactions through this platform.&rdquo;
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Because no commercial payments or credit/debit card gateway charges are processed by Bazarr360, no standard payment refund procedure is currently applicable.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          1. Marketplace Model &amp; Direct Offline Deals
        </h2>
        <p>
          Bazarr360 is a consumer-to-consumer (C2C) classifieds listing and video reel discovery platform.
        </p>
        <p>
          When you purchase an item discovered on Bazarr360, the transaction occurs <strong>directly between you (the buyer) and the third-party seller offline</strong>. Bazarr360:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Does not collect, process, hold, or disburse payments for listed products.</li>
          <li>Does not offer an online payment gateway (e.g. Razorpay, Stripe, Paytm, or credit card checkout) for listed items.</li>
          <li>Does not handle returns, product exchanges, courier shipping, or item refunds.</li>
        </ul>
        <p>
          Any refund, warranty, or return arrangement must be agreed upon directly between the buyer and the seller before finalizing the transaction.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          2. Platform Coins &amp; System Balances
        </h2>
        <p>
          Bazarr360 provides an internal coin ledger that may be awarded to users as promotional incentives (e.g., welcome bonus, engagement rewards, or administrative allocation) to test boost features for listings or reels.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>These coins are not purchased currency and cannot be bought with real money.</li>
          <li>Coins hold zero cash value and cannot be exchanged, withdrawn, or refunded for fiat currency.</li>
          <li>Coins are non-transferable and may expire or be revoked if an account violates community safety rules.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          3. Ad Listing Cancellation &amp; Deletion
        </h2>
        <p>
          Sellers may modify, mark as sold, or delete their listings and video reels at any time from their account dashboard at no cost.
        </p>
        <p>
          Because listing and posting video reels on Bazarr360 is currently free of charge, no listing fee cancellation or reimbursement applies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          4. Future Paid Services Framework
        </h2>
        <p>
          In the event that Bazarr360 introduces optional paid premium features, verified badge subscriptions, or paid promotion packages in the future:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>An updated Refund &amp; Cancellation Policy will be published with clear cancellation terms prior to accepting any payments.</li>
          <li>Clear pricing, applicable taxes (GST), payment terms, and statutory consumer rights under Indian law will be transparently outlined.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          5. Contacting Support
        </h2>
        <p>
          If you have questions about this policy or have encountered a suspicious user, please reach out to:
        </p>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-sm space-y-1">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">Bazarr360 Support</p>
          <p>Email: <a href="mailto:support@bazarr360.in" className="text-orange-600 font-semibold hover:underline">support@bazarr360.in</a></p>
          <p>Location: Pune, Maharashtra, India</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
