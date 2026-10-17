import React, { Suspense } from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

async function BusinessContent({ params }: BusinessPageProps) {
  const { slug } = await params;
  const formattedName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <PlaceholderPage
      title={`Business Store: ${formattedName}`}
      description="Dedicated storefront profile for verified commercial sellers, auto dealerships, agencies, and retail shops."
      category="public"
      routePath={`/business/${slug}`}
      params={{ slug }}
      plannedFeatures={[
        'Verified business badge and official GST/operating verification',
        'Storefront banner, logo, business hours, and operational address',
        'Dedicated catalog tab of active inventory and video showcases',
        'Business contact details and direct chat channel',
        'Customer ratings and reviews aggregation'
      ]}
      quickLinks={[
        { href: '/business/example-store', label: 'Example Store' },
        { href: '/business/mumbai-motors', label: 'Mumbai Motors' },
        { href: '/search', label: 'Marketplace Search' }
      ]}
    />
  );
}

export default function BusinessPage(props: BusinessPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading business storefront...</div>}>
      <BusinessContent {...props} />
    </Suspense>
  );
}
