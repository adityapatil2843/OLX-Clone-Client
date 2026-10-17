import React, { Suspense } from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedCategory = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <PlaceholderPage
      title={`Category: ${formattedCategory}`}
      description={`Browse verified listings, video reels, and local sellers in the ${formattedCategory} department.`}
      category="public"
      routePath={`/categories/${slug}`}
      params={{ slug }}
      plannedFeatures={[
        'Category-specific attribute filters (e.g., Year, Fuel Type, Mileage for Cars)',
        'Subcategory pills and quick breadcrumb navigation',
        'Featured video showcase carousel for top items',
        'Local radius search selector'
      ]}
      quickLinks={[
        { href: '/categories/cars', label: 'Cars' },
        { href: '/categories/electronics', label: 'Electronics' },
        { href: '/categories/properties', label: 'Properties' },
        { href: '/search', label: 'Global Search' }
      ]}
    />
  );
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading category segment...</div>}>
      <CategoryContent {...props} />
    </Suspense>
  );
}
