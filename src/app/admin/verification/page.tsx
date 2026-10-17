import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminVerificationPage() {
  return (
    <PlaceholderPage
      title="Seller Verification & KYC"
      description="Verification pipeline for inspecting government IDs, business registrations, GST certificates, and dealer licenses."
      category="admin"
      routePath="/admin/verification"
      plannedFeatures={[
        'Document verification viewer (Aadhaar/PAN preview, GSTIN validation)',
        'Merchant badge granting (Verified Seller, Top Dealer, Trusted Agency)',
        'Rejection with specific compliance deficiency reason',
        'Periodic re-verification scheduling and status renewal'
      ]}
      quickLinks={[
        { href: '/admin/users', label: 'User Directory' },
        { href: '/business/example-store', label: 'Preview Business Storefront' },
        { href: '/admin', label: 'Admin Dashboard' }
      ]}
    />
  );
}
