import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function ReelsPage() {
  return (
    <PlaceholderPage
      title="Reels & Video Feed"
      description="Short-form video discovery experience for products, vehicles, properties, and creator showcases. Designed for intuitive vertical swipe interactions and video-first marketplace listings."
      category="public"
      routePath="/reels"
      plannedFeatures={[
        'Vertical swipe full-screen video player',
        'Direct "Inquire / Chat with Seller" overlay',
        'Product tag chips linked to marketplace listings',
        'Audio track attribution and category filtering',
        'Seller profile shortcut and like/share indicators'
      ]}
      quickLinks={[
        { href: '/listing/123', label: 'View Sample Listing (#123)' },
        { href: '/categories/cars', label: 'Explore Cars Category' },
        { href: '/sell', label: 'Post an Ad' }
      ]}
    />
  );
}
