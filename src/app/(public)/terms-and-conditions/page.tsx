import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { AlertTriangle, CheckCircle, FileCheck, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Bazarr360 India',
  description:
    'Read the terms of use, marketplace community guidelines, and user agreement for Bazarr360 India video marketplace.',
  alternates: {
    canonical: 'https://www.bazarr360.in/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms & Conditions - Bazarr360',
    description: 'Read the terms of use and marketplace rules for Bazarr360.',
    url: 'https://www.bazarr360.in/terms-and-conditions',
    siteName: 'Bazarr360',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="These terms govern your access to and use of Bazarr360's website, mobile applications, marketplace classifieds, video reels, and communication services."
      lastUpdated="November 2026"
      activeRoute="/terms-and-conditions"
    >
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 not-prose mb-8">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">
          <FileCheck className="w-4 h-4 text-orange-600" />
          <span>User Agreement Summary</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Bazarr360 is a video-first classifieds and community discovery platform connecting independent buyers and sellers across India. Bazarr360 is not a seller, broker, escrow agent, or guarantor of offline transactions.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By creating an account, browsing listings, uploading video reels, or using any feature on <strong>Bazarr360</strong> (<a href="https://www.bazarr360.in" className="text-orange-600 hover:underline">https://www.bazarr360.in</a>) or our mobile app, you confirm that you have read, understood, and agreed to be bound by these Terms &amp; Conditions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          2. Platform Nature & Role
        </h2>
        <p>
          Bazarr360 operates as an online marketplace technology platform that allows registered users to publish advertisements (listings and short product video reels) for pre-owned goods, vehicles, electronics, properties, and general services.
        </p>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Important Marketplace Notice</span>
          </div>
          <p className="text-amber-800 dark:text-amber-300">
            Bazarr360 does not manufacture, inspect, own, store, or sell any of the items listed by third-party sellers. Any transaction, negotiation, delivery, or inspection is exclusively between the buyer and the seller. Bazarr360 does not act as an escrow provider or dispute guarantor for offline transactions.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          3. Eligibility & Age Requirement (Minimum Age: 13)
        </h2>
        <p>
          You must be at least <strong>13 years old</strong> to access or use Bazarr360. By registering an account, you represent and warrant that you meet this age threshold and possess the capacity to enter into this agreement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          4. User Accounts & Accurate Information
        </h2>
        <p>
          When registering an account, you agree to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide accurate, genuine, and current information.</li>
          <li>Keep your login credentials secure and confidential.</li>
          <li>Promptly notify Bazarr360 at <code>support@bazarr360.in</code> if you suspect unauthorized access to your account.</li>
          <li>Accept responsibility for all activity conducted through your account credentials.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          5. Prohibited Listings & Abusive Conduct
        </h2>
        <p>
          Users may not post, upload, or facilitate any content or listing that involves:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Stolen goods, counterfeit items, or replicas infringing intellectual property rights.</li>
          <li>Hazardous substances, illegal firearms, ammunition, tobacco, or restricted medicines.</li>
          <li>Deceptive, fraudulent, or miscategorized product listings.</li>
          <li>Harassment, hate speech, abusive language, or non-consensual media.</li>
          <li>Automated bots, scraping tools, site scrapers, or DDoS attacks against our servers.</li>
          <li>Financial scams, phishing requests, advance fee requests, or QR code payment frauds.</li>
        </ul>
        <p>
          Violations will result in immediate suspension, listing removal, and potential reporting to law enforcement authorities.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          6. User-Generated Content & Limited License
        </h2>
        <p>
          You retain all ownership rights to the photos, product reels, descriptions, and comments you upload to Bazarr360.
        </p>
        <p>
          However, by uploading content, you grant Bazarr360 a worldwide, non-exclusive, royalty-free, transferable license to host, display, resize, distribute, and index your content solely for the purpose of operating, improving, and promoting the marketplace service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          7. Buyer Safety & In-Person Verification
        </h2>
        <p>
          For your safety, we strongly recommend following these guidelines:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Always meet in secure, well-lit public places during daytime hours.</li>
          <li>Never transfer advance token payments or delivery fees before personally inspecting the item.</li>
          <li>Remember: you NEVER need to scan a QR code or enter your UPI PIN to receive money.</li>
          <li>Thoroughly verify vehicle registration documents, mobile IMEI numbers, and gadget operation before paying.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          8. Wallet & Promotional Coins
        </h2>
        <p>
          Bazarr360 features an internal coin ledger that may be allocated by the system or administrators (e.g., welcome bonuses, campaign rewards, promotional boost allocation).
        </p>
        <p>
          These coins:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Are not real-money currency.</li>
          <li>Hold no cash value and cannot be redeemed for fiat currency.</li>
          <li>Are non-transferable and non-refundable.</li>
          <li>May only be used within Bazarr360 to boost listing or reel visibility when enabled.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          9. Account Suspension & Termination
        </h2>
        <p>
          Bazarr360 reserves the right to suspend or terminate any user account without prior notice if we determine that the user has violated these terms, engaged in fraudulent activities, or posed a safety risk to the community.
        </p>
        <p>
          You may close your account at any time by following the instructions on our{' '}
          <Link href="/delete-account" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
            Delete Account Page
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          10. Disclaimer of Warranties & Limitation of Liability
        </h2>
        <p>
          The Bazarr360 platform and all its services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied.
        </p>
        <p>
          To the maximum extent permitted by applicable law, Bazarr360 and its operators shall not be liable for any indirect, punitive, or consequential damages resulting from offline transactions, seller representations, defective items, or temporary site downtime.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          11. Governing Law & Contact
        </h2>
        <p>
          These terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra, India</strong>.
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
