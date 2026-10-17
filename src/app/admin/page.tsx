import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminDashboardPage() {
  return (
    <PlaceholderPage
      title="Admin Operations Dashboard"
      description="Central command center for marketplace health, key metrics, moderation backlogs, user safety alerts, and system status across India."
      category="admin"
      routePath="/admin"
      plannedFeatures={[
        'Live summary metrics (Active Listings, Daily Video Reels, Registered Users, Pending Reports)',
        'Moderation queue backlog summary and urgency alerts',
        'State/City regional transaction volume breakdown',
        'System health and service status indicators'
      ]}
      quickLinks={[
        { href: '/admin/users', label: 'User Directory' },
        { href: '/admin/listings', label: 'Listings Review' },
        { href: '/admin/reels', label: 'Reels Moderation' },
        { href: '/admin/reports', label: 'Reports Queue' },
        { href: '/admin/verification', label: 'KYC Verification' },
        { href: '/admin/audit-logs', label: 'Audit Logs' }
      ]}
    />
  );
}
