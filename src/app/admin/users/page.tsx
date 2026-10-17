import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminUsersPage() {
  return (
    <PlaceholderPage
      title="User Management & Accounts"
      description="Administrative directory of registered buyers, sellers, business accounts, and moderators. Search by phone, email, or account ID."
      category="admin"
      routePath="/admin/users"
      plannedFeatures={[
        'Comprehensive user search by Phone number, Email, or User ID',
        'Account status management (Active, Suspended, Banned, Under Review)',
        'Role assignment (User, Verified Dealer, Moderator, Super Admin)',
        'User history view: past listings, reported chats, active reels',
        'Ban with cooldown or permanent restriction workflow'
      ]}
      quickLinks={[
        { href: '/admin', label: 'Admin Dashboard' },
        { href: '/admin/verification', label: 'Pending Verifications' },
        { href: '/admin/audit-logs', label: 'Audit Trail' }
      ]}
    />
  );
}
