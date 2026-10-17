import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function ServicesPage() {
  return (
    <PlaceholderPage
      title="Local Services Directory"
      description="Find and connect with trusted local service providers including home repairs, electronics servicing, drivers, carpenters, tutors, and event professionals."
      category="public"
      routePath="/services"
      plannedFeatures={[
        'Service category classification and verified badge indicators',
        'Direct inquiry and callback request form',
        'Local radius and emergency service availability filters',
        'Customer testimonials and portfolio photo galleries'
      ]}
      quickLinks={[
        { href: '/jobs', label: 'Explore Jobs' },
        { href: '/sell', label: 'Offer a Service' },
        { href: '/search', label: 'Global Search' }
      ]}
    />
  );
}
