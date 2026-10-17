import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function SellPage() {
  return (
    <PlaceholderPage
      title="Post an Ad / Sell"
      description="Listing creation workflow for individuals and businesses. Built for video-first showcase upload, categorized specification forms, pricing, and location tagging."
      category="account"
      routePath="/sell"
      plannedFeatures={[
        'Video Reel uploader (up to 60s) with vertical preview trimmer',
        'Multi-image high-resolution photo uploader (up to 10 photos)',
        'Hierarchical category and subcategory selector',
        'Dynamic attribute schema based on selected category (e.g., Year/KM for vehicles)',
        'GPS & city/pincode location detection',
        'Price field with negotiable toggle and safety recommendations'
      ]}
      quickLinks={[
        { href: '/listing/123', label: 'View Sample Listing Output' },
        { href: '/chats', label: 'Check Chats' },
        { href: '/categories/cars', label: 'Explore Categories' }
      ]}
    />
  );
}
