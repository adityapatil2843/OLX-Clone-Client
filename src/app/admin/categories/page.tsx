import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function AdminCategoriesPage() {
  return (
    <PlaceholderPage
      title="Category & Taxonomy Management"
      description="Administrative catalog hierarchy manager for configuring categories, subcategories, custom attributes, and search filters."
      category="admin"
      routePath="/admin/categories"
      plannedFeatures={[
        'Interactive category tree editor (Reorder, add new, nest subcategories)',
        'Dynamic custom fields builder (Define required attributes per category, e.g. Year for Cars)',
        'Category icon and thumbnail upload manager',
        'SEO metadata, canonical URLs, and schema markup configurator per category'
      ]}
      quickLinks={[
        { href: '/categories/cars', label: 'View Public Cars Category' },
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/listings', label: 'Listings' }
      ]}
    />
  );
}
