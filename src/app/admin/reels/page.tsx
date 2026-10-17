import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminReelsPage() {
  return (
    <PlaceholderPage
      title="Reels & Video Moderation"
      description="Content safety verification for user-submitted video showcases, product reels, and creator marketplace clips."
      category="admin"
      routePath="/admin/reels"
      plannedFeatures={[
        'Video playback review interface with variable speed playback',
        'Flag categories (Prohibited Goods, Explicit Content, Fraudulent Pricing, Copyright)',
        'Take-down actions with automated seller email/SMS notifications',
        'Trending Reels manual pin/feature curator tools',
        'Transcoding and video format diagnostic inspection'
      ]}
      quickLinks={[
        { href: '/reels', label: 'Public Reels Feed' },
        { href: '/admin/listings', label: 'Listing Moderation' },
        { href: '/admin/reports', label: 'Reported Content' }
      ]}
    />
  );
}
