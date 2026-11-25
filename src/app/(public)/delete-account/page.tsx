import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { UserX, Mail, AlertTriangle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delete Account & Data - Bazarr360 India',
  description:
    'Instructions on how to request deletion of your Bazarr360 account, profile, listings, and associated personal data.',
  alternates: {
    canonical: 'https://www.bazarr360.in/delete-account',
  },
  openGraph: {
    title: 'Delete Account & Data - Bazarr360',
    description: 'Learn how to request deletion of your Bazarr360 account and personal data.',
    url: 'https://www.bazarr360.in/delete-account',
    siteName: 'Bazarr360',
  },
};

export default function DeleteAccountPage() {
  return (
    <LegalPageLayout
      title="Delete Account & Data"
      description="You have the right to request deletion of your Bazarr360 account and associated personal data at any time."
      lastUpdated="November 2026"
      activeRoute="/delete-account"
    >
      {/* 30-Day Timeline Highlight */}
      <div className="p-5 rounded-2xl border-2 border-red-500/20 bg-red-50/40 dark:bg-red-950/20 not-prose mb-8">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              30-Day Data Deletion Commitment
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upon receiving your verified request, Bazarr360 will deactivate your account and complete the permanent deletion of your profile, listings, product reels, and personal records within <strong>30 calendar days</strong>.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          1. How to Request Account Deletion
        </h2>
        <p>
          You can request the complete deletion of your account and personal data using either of the following straightforward methods:
        </p>

        {/* Method 1: Email Support */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 not-prose space-y-3">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            <Mail className="w-4 h-4 text-orange-600" />
            <span>Method A: Send an Email to Support</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Send an email from your registered email address to{' '}
            <a href="mailto:support@bazarr360.in" className="text-orange-600 font-bold hover:underline">
              support@bazarr360.in
            </a>{' '}
            with the subject line <code>&ldquo;Account Deletion Request&rdquo;</code>.
          </p>
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Please include in your email:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Your full registered name</li>
              <li>Your registered email address and/or mobile phone number</li>
              <li>A clear statement: &ldquo;I request the permanent deletion of my Bazarr360 account and associated data.&rdquo;</li>
            </ul>
          </div>
          <div>
            <a
              href="mailto:support@bazarr360.in?subject=Account%20Deletion%20Request&body=Hello%20Bazarr360%20Support%2C%0A%0AI%20request%20the%20permanent%20deletion%20of%20my%20Bazarr360%20account%20and%20all%20associated%20personal%20data.%0A%0ARegistered%20Name%3A%20%0ARegistered%20Email%3A%20%0ARegistered%20Phone%3A%20%0A%0AThank%20you."
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Draft Deletion Email</span>
            </a>
          </div>
        </div>

        {/* Method 2: In-App Mobile Flow */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 not-prose space-y-2 mt-4">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            <UserX className="w-4 h-4 text-orange-600" />
            <span>Method B: Via the Mobile App</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            If you are using the Bazarr360 mobile app, you can initiate account deletion directly:
          </p>
          <ol className="list-decimal pl-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
            <li>Open the Bazarr360 mobile app and go to the <strong>Account</strong> tab.</li>
            <li>Select <strong>Settings</strong> &rarr; <strong>Account Privacy &amp; Deletion</strong>.</li>
            <li>Tap <strong>Request Account Deletion</strong> and confirm your submission.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          2. What Happens When Your Account Is Deleted
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Public Discovery:</strong> Your user profile, seller verification status, public contact information, active marketplace listings, and video reels are immediately unlisted.
          </li>
          <li>
            <strong>Media Assets:</strong> Uploaded product photos and video clips stored in our media CDN are scheduled for permanent purge.
          </li>
          <li>
            <strong>Messaging &amp; Wishlist:</strong> Your saved favorites and active chat sessions are disassociated from your user identity.
          </li>
          <li>
            <strong>Coins Balance:</strong> Any promotional coin balance in your wallet is forfeited upon account closure.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          3. Legally Required &amp; Security Retention Exceptions
        </h2>
        <p>
          In accordance with Google Play Data Safety standards and applicable laws of India, certain minimal records may be retained past the 30-day deletion window strictly for:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Compliance with statutory tax, accounting, or legal regulatory obligations.</li>
          <li>Resolution of ongoing dispute reports, fraud investigations, or active law enforcement requests.</li>
          <li>Prevention of ban evasion by users terminated for malicious behavior or safety violations.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          4. Contact Us
        </h2>
        <p>
          For any questions or follow-ups regarding a submitted deletion request, please reach out to our privacy desk:
        </p>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-sm space-y-1">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">Bazarr360 Data Privacy Desk</p>
          <p>Email: <a href="mailto:support@bazarr360.in" className="text-orange-600 font-semibold hover:underline">support@bazarr360.in</a></p>
          <p>Location: Pune, Maharashtra, India</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
