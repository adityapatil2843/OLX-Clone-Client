import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - Bazarr360 India',
  description:
    'Learn how Bazarr360 collects, uses, and safeguards user data across our video-first marketplace for cars, mobiles, electronics, and goods in India.',
  alternates: {
    canonical: 'https://www.bazarr360.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy - Bazarr360',
    description:
      'Learn how Bazarr360 collects, protects, and handles your information on India video marketplace.',
    url: 'https://www.bazarr360.in/privacy-policy',
    siteName: 'Bazarr360',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="This policy outlines how Bazarr360 collects, stores, processes, and protects your information when you use our marketplace, video reels, and messaging services."
      lastUpdated="November 2026"
      activeRoute="/privacy-policy"
    >
      {/* Overview Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-8">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Third-Party Ad Trackers</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Bazarr360 does not run third-party advertising tracking networks, Google Analytics, Firebase, or external behavioral marketing pixels.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">
            <Lock className="w-4 h-4 text-orange-600" />
            <span>30-Day Account Deletion</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            You retain full control over your profile. Account deletion requests are processed within 30 days.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          1. Introduction & Scope
        </h2>
        <p>
          Welcome to <strong>Bazarr360</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), a video-first classifieds and marketplace platform operated out of <strong>Pune, Maharashtra, India</strong>. This Privacy Policy applies to our website (<a href="https://www.bazarr360.in" className="text-orange-600 hover:underline">https://www.bazarr360.in</a>) and our mobile applications.
        </p>
        <p>
          We are committed to operating an honest, transparent platform that respects user privacy. This policy explains what information is collected, why it is needed, how it is secured, and your rights regarding your data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          2. Information We Collect (Evidenced by Code)
        </h2>
        <p>
          Bazarr360 collects only the information necessary to provide marketplace and community discovery features:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Account & Profile Data:</strong> When registering, you provide your name, email address, password (stored strictly as a cryptographic hash), and optional mobile phone number, location (State, District/City), and profile avatar.
          </li>
          <li>
            <strong>Marketplace Listings & Media:</strong> Details of items you list for sale (title, category, price in INR, description, location, contact phone number, and uploaded product photos or short video reels).
          </li>
          <li>
            <strong>Product Video Reels:</strong> Short-form product showcase videos uploaded by users to highlight goods, along with captions, hashtags, and product tags.
          </li>
          <li>
            <strong>Direct Buyer-Seller Chats:</strong> In-app messaging text, image attachments, and listing shares exchanged between buyers and sellers within the platform.
          </li>
          <li>
            <strong>Favorites & Interactions:</strong> Items added to your saved watchlist, reel likes, and reel comments.
          </li>
          <li>
            <strong>Safety & Moderation Reports:</strong> Inquiries, dispute tickets, and reports filed against suspicious listings or abusive accounts.
          </li>
          <li>
            <strong>Technical & Session Data:</strong> Authentication tokens (JWT access and refresh tokens), one-time passcode (OTP) verification records, and standard server request logs for rate-limiting and security defense.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          3. How We Use Your Information
        </h2>
        <p>
          We use collected data solely for the following operational purposes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To create, authenticate, and administer your Bazarr360 user account.</li>
          <li>To publish marketplace listings and video reels so local buyers can discover them.</li>
          <li>To facilitate direct real-time communication between prospective buyers and sellers.</li>
          <li>To display location-relevant search results and category recommendations.</li>
          <li>To maintain platform security, prevent spam, combat fraudulent postings, and moderate abuse.</li>
          <li>To respond to your support queries sent to <code>support@bazarr360.in</code>.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          4. External Services & Tracking Disclosure
        </h2>
        <p>
          Based on our codebase architecture, we provide the following honest statements:
        </p>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Current Service Profile</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300">
            Bazarr360 currently <strong>does NOT</strong> use Google Analytics, Firebase, third-party advertising SDKs, commercial tracking beacons, Google/social single sign-on, or third-party push notification providers.
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            We use <strong>Cloudinary</strong> for optimized media delivery (photos and video reels) and <strong>Sentry</strong> for application error diagnostics and uptime stability.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          5. Data Sharing & Disclosure
        </h2>
        <p>
          We do not sell, rent, or trade your personal information to marketing brokers or third parties. We disclose data only in the following limited circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Public Marketplace Visibility:</strong> Information you publish deliberately in public listings (title, photos, reels, seller city, and contact phone number if enabled) is visible to other platform users.
          </li>
          <li>
            <strong>Infrastructure Service Providers:</strong> Cloud hosting, database infrastructure, and CDN media storage providers that operate under strict confidentiality.
          </li>
          <li>
            <strong>Legal & Regulatory Requirements:</strong> We may disclose information if required to do so by applicable Indian law, court order, or formal law enforcement investigation in Pune, Maharashtra or applicable Indian jurisdictions.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          6. Data Retention & Account Deletion (30-Day Timeline)
        </h2>
        <p>
          We retain your account data for as long as your account remains active. If you request deletion of your account:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Your public profile, active listings, and video reels are removed from public discovery.
          </li>
          <li>
            Your personal account data will be permanently purged within <strong>30 days</strong> of receiving your verified request.
          </li>
          <li>
            Certain non-identifying transaction logs, fraud-prevention flags, or records required by applicable statutory regulations may be retained as permitted by law.
          </li>
        </ul>
        <p>
          To request deletion, visit our{' '}
          <Link href="/delete-account" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
            Account Deletion Page
          </Link>{' '}
          or email <a href="mailto:support@bazarr360.in" className="text-orange-600 hover:underline">support@bazarr360.in</a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          7. Children&rsquo;s Privacy (Minimum Age: 13)
        </h2>
        <p>
          Bazarr360 is intended strictly for users who are at least <strong>13 years of age</strong> or older. We do not knowingly solicit or collect personal information from individuals under the age of 13. If we become aware that an account belongs to a user under 13, we will promptly deactivate the account and delete the associated data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          8. Security Measures & Realistic Limitations
        </h2>
        <p>
          We employ industry-standard security practices, including cryptographic password hashing, token expiration, access control validation, and HTTPS encrypted transit.
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic">
          Please note that no electronic storage or transmission over the internet can be guaranteed as 100% immune from security breaches. We advise users to maintain unique passwords and avoid sharing sensitive financial credentials or UPI PINs over chat.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          9. Contact Us
        </h2>
        <p>
          For privacy questions, access requests, or data rectification, contact our privacy desk:
        </p>
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-sm space-y-1">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">Bazarr360 Support & Privacy Desk</p>
          <p>Email: <a href="mailto:support@bazarr360.in" className="text-orange-600 font-semibold hover:underline">support@bazarr360.in</a></p>
          <p>Location: Pune, Maharashtra, India</p>
          <p>Website: <a href="https://www.bazarr360.in" className="text-orange-600 hover:underline">https://www.bazarr360.in</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
