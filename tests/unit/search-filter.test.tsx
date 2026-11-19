import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { SearchFilterDrawer } from '../../src/components/search/SearchFilterDrawer';
import { SearchPageView } from '../../src/components/search/SearchPageView';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams('q=Phone&city=Mumbai&category=mobiles&sort=price_asc'),
}));

describe('Search and Filter UX Tests', () => {
  it('renders SearchFilterDrawer with categories, location, price, and sort controls', () => {
    const html = renderToString(
      <SearchFilterDrawer
        isOpen={true}
        onClose={() => {}}
        initialFilters={{
          category: 'mobiles',
          state: 'Maharashtra',
          city: 'Mumbai',
          minPrice: '5000',
          maxPrice: '50000',
          sortBy: 'price_asc',
        }}
        categories={[
          { id: '11111111-1111-1111-1111-111111111111', name: 'Mobiles', slug: 'mobiles' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'Vehicles', slug: 'vehicles' },
        ]}
        onApplyFilters={() => {}}
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('Filters &amp; Sorting');
    expect(html).toContain('Category');
    expect(html).toContain('Location Filter');
    expect(html).toContain('Price Range');
    expect(html).toContain('Sort By');
    expect(html).toContain('Apply Filters');
    expect(html).toContain('Reset');
  });

  it('renders SearchPageView with active filter chips and results count', () => {
    const html = renderToString(
      <SearchPageView
        initialQuery="Phone"
        initialCategory="mobiles"
        initialCity="Mumbai"
      />
    );

    expect(html).toContain('Explore Marketplace');
    expect(html).toContain('Active:');
    expect(html).toContain('Query: &quot;Phone&quot;');
    expect(html).toContain('Category: mobiles');
    expect(html).toContain('City: Mumbai');
    expect(html).toContain('Clear All');
    expect(html).toContain('Filters');
  });
});
