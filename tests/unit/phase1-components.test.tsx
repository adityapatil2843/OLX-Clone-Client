import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ListingCard } from '../../src/components/listings/ListingCard';
import { EmptyState } from '../../src/components/ui/empty-state';
import { ReelCard } from '../../src/components/reels/ReelCard';
import { formatINR, formatRelativeDate, formatCompactNumber } from '../../src/lib/formatters';
import { MOCK_LISTINGS } from '../../src/features/marketplace/mockData';
import { MOCK_REELS } from '../../src/features/reels/mockData';

describe('Phase 1 Marketplace Components', () => {
  it('formats INR currency correctly', () => {
    const formatted = formatINR(1475000);
    expect(formatted).toContain('14,75,000');
  });

  it('formats relative date correctly', () => {
    const recentIso = new Date().toISOString();
    expect(formatRelativeDate(recentIso)).toBe('Just now');
  });

  it('renders ListingCard with title, price, and location', () => {
    const sample = MOCK_LISTINGS[0];
    const html = renderToString(<ListingCard listing={sample} />);

    expect(html).toContain(sample.title);
    expect(html).toContain('14,75,000');
    expect(html).toContain('Bandra West');
  });

  it('renders EmptyState with custom title and description', () => {
    const html = renderToString(
      <EmptyState
        title="No Results Found"
        description="Try clearing your filters"
        actionTitle="Clear Filters"
      />
    );

    expect(html).toContain('No Results Found');
    expect(html).toContain('Try clearing your filters');
    expect(html).toContain('Clear Filters');
  });

  it('formats compact metrics in ReelCard', () => {
    expect(formatCompactNumber(12500)).toBe('12.5k');
    expect(formatCompactNumber(2500000)).toBe('2.5M');
    expect(formatCompactNumber(450)).toBe('450');
  });

  it('renders ReelCard with creator name and title', () => {
    const reel = MOCK_REELS[0];
    const html = renderToString(<ReelCard reel={reel} />);

    expect(html).toContain(reel.creator.name);
    expect(html).toContain('Hyundai Creta');
  });
});
