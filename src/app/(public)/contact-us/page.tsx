import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Mail, MapPin, Clock, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Bazarr360 India',
  description:
    'Get in touch with the Bazarr360 customer support team for marketplace inquiries, safety reports, and technical assistance.',
  alternates: {
    canonical: 'https://www.bazarr360.in/contact-us',
  },
  openGraph: {
    title: 'Contact Us - Bazarr360',
    description: 'Contact the Bazarr360 customer support team.',
    url: 'https://www.bazarr360.in/contact-us',
    siteName: 'Bazarr360',
  },
};

export default function ContactUsPage() {
  return (
    <LegalPageLayout
      title="Contact Us"
      description="We are here to help. Reach out to the Bazarr360 team for account assistance, listing queries, safety reports, or general support."
      lastUpdated="November 2026"
      activeRoute="/contact-us"
    >
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-8">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Official Email</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Direct inquiries, user support, and safety reports.
            </p>
          </div>
          <a
            href="mailto:support@bazarr360.in"
            className="mt-4 text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline break-all"
          >
            support@bazarr360.in
          </a>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Response Time</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              We aim to respond to all inquiries as soon as reasonably possible.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Typically within 24 to 48 business hours
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Registered Location</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Headquarters and engineering operations.
            </p>
          </div>
          <span className="mt-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Pune, Maharashtra, India
          </span>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          How to Reach Us
        </h2>
        <p>
          The fastest way to receive assistance with your account, listings, or technical concerns is to send an email to our centralized support address:
        </p>
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 not-prose flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base">support@bazarr360.in</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Please include your registered email or phone number for faster verification.
            </p>
          </div>
          <a
            href="mailto:support@bazarr360.in?subject=Bazarr360%20Support%20Inquiry"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          Helpful Tips for Faster Resolution
        </h2>
        <p>
          To help us resolve your inquiry quickly, please include the following details in your message:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Registered Account Details:</strong> The email address or mobile number associated with your Bazarr360 account.</li>
          <li><strong>Listing Reference:</strong> If your inquiry relates to an advertisement or reel, include the listing title, URL, or seller name.</li>
          <li><strong>Clear Description:</strong> A brief description of the issue encountered, including screenshots if applicable.</li>
          <li><strong>Device &amp; Browser:</strong> Mention whether you are using our web application or mobile app (Android/iOS) and your operating system.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
          Reporting Fraud &amp; Safety Violations
        </h2>
        <p>
          If you have identified a suspicious seller, fraudulent listing, prohibited merchandise, or abusive user:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Use the in-app <strong>Report Listing</strong> or <strong>Report User</strong> button available on every listing, reel, and chat screen.
          </li>
          <li>
            Email full details to <a href="mailto:support@bazarr360.in" className="text-orange-600 font-semibold hover:underline">support@bazarr360.in</a> with the subject line <code>&ldquo;URGENT: Safety Report&rdquo;</code>.
          </li>
        </ul>
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-xs sm:text-sm space-y-1">
          <p className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Critical Security Notice</span>
          </p>
          <p className="text-red-800 dark:text-red-300">
            Bazarr360 staff will NEVER ask for your password, One-Time Password (OTP), credit card CVV, bank account details, or UPI PIN. Never share these credentials with anyone.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
