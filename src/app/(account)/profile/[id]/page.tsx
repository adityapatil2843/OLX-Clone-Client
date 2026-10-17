import React, { Suspense } from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function ProfileContent({ params }: ProfilePageProps) {
  const { id } = await params;
  const formattedUsername = id.replace(/[-_]/g, ' ');

  return (
    <PlaceholderPage
      title={`User Profile: ${formattedUsername}`}
      description="Public seller profile showing member badge, verification tier, active listings count, published reels, and customer feedback."
      category="account"
      routePath={`/profile/${id}`}
      params={{ id }}
      plannedFeatures={[
        'Seller trust badge, member-since date, and verified phone badge',
        'Active catalog tab showing user listings with live statuses',
        'Reels showcase tab with views and engagement counters',
        'Public buyer reviews and community ratings',
        'Account settings edit modal (when viewed by profile owner)'
      ]}
      quickLinks={[
        { href: '/profile/example-user', label: 'Example User Profile' },
        { href: '/profile/seller-priya-99', label: 'Seller Priya Profile' },
        { href: '/chats', label: 'Chats' },
        { href: '/sell', label: 'Post an Ad' }
      ]}
    />
  );
}

export default function ProfilePage(props: ProfilePageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading user profile...</div>}>
      <ProfileContent {...props} />
    </Suspense>
  );
}
