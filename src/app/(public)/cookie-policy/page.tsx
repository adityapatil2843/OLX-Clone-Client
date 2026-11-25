import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Cookie, ShieldCheck, CheckCircle2, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - Bazarr360 India',
  description:
    'Learn how cookies, local session storage, and security tokens are handled on the Bazarr360 platform.',
  alternates: {
    canonical: 'https://www.bazarr360.in/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy - Bazarr360',
    description: 'Read how Bazarr360 handles cookies and local session storage.',
    url: 'https://www.bazarr360.in/cookie-policy',
    siteName: 'Bazarr360',
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Transparency regarding our use of cookies, local storage, and session tokens across the Bazarr360 platform."
      lastUpdated="November 2026"
      activeRoute="/cookie-policy"
    >
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 not-prose mb-8">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No Non-Essential or Tracking Cookies</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Based on our code architecture, Bazarr360 does not place marketing, advertising, cross-site profiling, or behavioral tracking cookies on your device.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          1. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work efficiently, recognize devices across visits, and remember user preferences.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          2. How Bazarr360 Uses Cookies &amp; Local Storage
        </h2>
        <p>
          Bazarr360 is built using modern token-based authentication. We prioritize user privacy and limit client-side storage to strictly necessary operational functions:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Essential Session &amp; Authentication Tokens:</strong> We use local storage and secure in-memory tokens (JWT access tokens and refresh tokens) to keep you securely signed in to your account while browsing or posting listings.
          </li>
          <li>
            <strong>User Preferences:</strong> Local storage is used to remember your preferred location (e.g. Pune, Mumbai, Delhi) and theme preferences (light/dark mode) so you don&rsquo;t need to reselect them on every page load.
          </li>
          <li>
            <strong>Security &amp; Abuse Prevention:</strong> Standard HTTP request headers and tokens are used to prevent Cross-Site Request Forgery (CSRF) and block malicious automated bot attacks.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          3. Third-Party Tracking &amp; Advertising Cookies
        </h2>
        <p>
          Many online classifieds websites use third-party ad networks and behavioral tracking pixels to target advertisements across the web.
        </p>
        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
          Bazarr360 does NOT use:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Google Analytics or advertising cookies</li>
          <li>Facebook / Meta Pixel or social media tracking beacons</li>
          <li>Third-party programmatic advertising retargeting cookies</li>
          <li>Cross-app device tracking SDKs</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          4. Managing Cookies in Your Browser
        </h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can choose to block cookies, delete existing cookies, or configure your browser to alert you when a cookie is placed:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Cookies and other site data</li>
          <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Enhanced Tracking Protection</li>
          <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Block all cookies</li>
          <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions</li>
        </ul>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Please note that disabling strictly necessary session tokens or local storage may prevent you from logging in, posting listings, or chatting with sellers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          5. Contact Us
        </h2>
        <p>
          If you have questions regarding our cookie practices, please contact us:
        </p>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-sm space-y-1">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">Bazarr360 Technical Support</p>
          <p>Email: <a href="mailto:support@bazarr360.in" className="text-orange-600 font-semibold hover:underline">support@bazarr360.in</a></p>
          <p>Location: Pune, Maharashtra, India</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
