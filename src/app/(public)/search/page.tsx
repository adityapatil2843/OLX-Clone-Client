import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function SearchPage() {
  return (
    <PlaceholderPage
      title="Marketplace Search & Filters"
      description="Location-aware query engine and multi-attribute filters across listings, categories, verified businesses, jobs, and services across India."
      category="public"
      routePath="/search"
      plannedFeatures={[
        'Keyword search with instant auto-suggestions',
        'State and City / Pin-code location boundary filtering',
        'Price range sliders and verified seller toggles',
        'Sort by relevance, newest, and distance',
        'View toggle between Grid view and Video Reels view'
      ]}
      quickLinks={[
        { href: '/categories/cars', label: 'Cars Category' },
        { href: '/jobs', label: 'Search Jobs' },
        { href: '/services', label: 'Search Services' }
      ]}
    />
  );
}
