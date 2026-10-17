import React, { Suspense } from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

async function ListingContent({ params }: ListingPageProps) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title={`Listing #${id}`}
      description="Full detail view for an individual marketplace listing. Includes video reel preview, high-resolution photo gallery, specifications, seller badge, and direct buyer chat initiation."
      category="public"
      routePath={`/listing/${id}`}
      params={{ id }}
      plannedFeatures={[
        'Full HD multi-image and video carousel',
        'Direct "Chat with Seller" action with quick-offer presets',
        'Verified seller information card and location map boundary',
        'Safety tips banner and report listing action',
        'Similar recommended listings in the same category'
      ]}
      quickLinks={[
        { href: '/listing/123', label: 'Listing 123' },
        { href: '/listing/premium-car-456', label: 'Listing 456' },
        { href: '/chats', label: 'Go to Chats' },
        { href: '/categories/cars', label: 'Back to Category' }
      ]}
    />
  );
}

export default function ListingPage(props: ListingPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading listing details...</div>}>
      <ListingContent {...props} />
    </Suspense>
  );
}
