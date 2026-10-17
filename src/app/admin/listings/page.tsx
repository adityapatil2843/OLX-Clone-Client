import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminListingsPage() {
  return (
    <PlaceholderPage
      title="Listings Moderation Queue"
      description="Review and moderation pipeline for marketplace product ads, vehicle listings, real estate, jobs, and service postings."
      category="admin"
      routePath="/admin/listings"
      plannedFeatures={[
        'Pending approval queue for high-risk or flagged categories',
        'Bulk actions (Approve, Reject with Reason, Request Revision)',
        'Automated prohibited keyword and scam detection flags',
        'Image check against duplicate/copyright infringements',
        'Direct link to seller history and past dispute records'
      ]}
      quickLinks={[
        { href: '/admin/reels', label: 'Moderate Reels' },
        { href: '/admin/reports', label: 'View Reports' },
        { href: '/listing/123', label: 'Preview Sample Listing' }
      ]}
    />
  );
}
