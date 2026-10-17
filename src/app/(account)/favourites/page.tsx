import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function FavouritesPage() {
  return (
    <PlaceholderPage
      title="Saved Favourites & Watchlist"
      description="Personal collection of bookmarked listings, saved video reels, and monitored price drops."
      category="account"
      routePath="/favourites"
      plannedFeatures={[
        'Tabbed grid of Saved Items and Saved Reels',
        'Real-time price change alerts and active availability status',
        'One-click direct chat initiation from saved card',
        'Quick share and export watchlist options'
      ]}
      quickLinks={[
        { href: '/listing/123', label: 'View Sample Listing' },
        { href: '/reels', label: 'Browse Reels' },
        { href: '/search', label: 'Search Marketplace' }
      ]}
    />
  );
}
