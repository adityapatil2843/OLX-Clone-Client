import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { BottomNav } from '../../src/components/layout/BottomNav';
import { ListingCard } from '../../src/components/listings/ListingCard';
import { ListingDetailView } from '../../src/components/listings/ListingDetailView';
import { ReelCard } from '../../src/components/reels/ReelCard';
import { MOCK_LISTINGS } from '../../src/features/marketplace/mockData';
import { MOCK_REELS } from '../../src/features/reels/mockData';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

describe('Mobile App Experience Parity Tests', () => {
  it('renders all 5 mobile app tabs in BottomNav', () => {
    const html = renderToString(<BottomNav />);

    expect(html).toContain('Home');
    expect(html).toContain('Explore');
    expect(html).toContain('Sell');
    expect(html).toContain('Chats');
    expect(html).toContain('Account');
  });

  it('renders ListingCard with touch-friendly elements and verified badge', () => {
    const sample = MOCK_LISTINGS[0];
    const html = renderToString(<ListingCard listing={sample} />);

    expect(html).toContain(sample.title);
    expect(html).toContain('Verified');
    expect(html).toContain('/listing/');
  });

  it('renders ReelCard with duration, creator, and action buttons', () => {
    const reel = MOCK_REELS[0];
    const html = renderToString(<ReelCard reel={reel} />);

    expect(html).toContain(reel.creator.name);
    expect(html).toContain('Hyundai Creta');
    expect(html).toContain(String(reel.durationSeconds));
    expect(html).toContain('Watch Reel');
  });

  it('renders ListingDetailView with mobile safe-area sticky actions above bottom nav', () => {
    const sample = MOCK_LISTINGS[0];
    const html = renderToString(
      <ListingDetailView listing={sample} relatedListings={MOCK_LISTINGS.slice(1, 3)} />
    );

    expect(html).toContain('safe-area-inset-bottom');
    expect(html).toContain('Chat');
    expect(html).toContain('Call');
    expect(html).toContain('pb-36');
  });
});
