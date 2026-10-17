import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function JobsPage() {
  return (
    <PlaceholderPage
      title="Jobs & Employment Board"
      description="India-focused local employment board for blue-collar, entry-level, delivery, retail, technical, and skilled trade roles."
      category="public"
      routePath="/jobs"
      plannedFeatures={[
        'Role filtering (Full-time, Part-time, Work from home, Daily wage)',
        'Salary expectation filters and direct phone/chat apply',
        'Company hiring verification badge',
        'Quick candidate resume/profile submission'
      ]}
      quickLinks={[
        { href: '/services', label: 'Local Services' },
        { href: '/sell', label: 'Post a Job Ad' },
        { href: '/search', label: 'Marketplace Search' }
      ]}
    />
  );
}
