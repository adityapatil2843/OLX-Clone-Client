import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminReportsPage() {
  return (
    <PlaceholderPage
      title="User Reports & Dispute Resolution"
      description="Investigation inbox for user-flagged listings, offensive chats, impersonation, suspected fraud, and pricing scams."
      category="admin"
      routePath="/admin/reports"
      plannedFeatures={[
        'Categorized dispute ticketing system (Scam, Counterfeit, Harassment, Inappropriate Media)',
        'Linked evidence snapshots (Chat logs, listing revisions, reporter statement)',
        'Moderator assignment and status tracking (Investigating, Resolved, Dismissed)',
        'Predefined escalation actions (Warning issued, Item removed, Account banned)'
      ]}
      quickLinks={[
        { href: '/admin/users', label: 'User Directory' },
        { href: '/admin/listings', label: 'Listing Queue' },
        { href: '/admin/audit-logs', label: 'Audit Trail' }
      ]}
    />
  );
}
