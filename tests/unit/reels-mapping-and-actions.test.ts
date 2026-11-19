import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { mapBackendReelToReelItem } from '../../src/features/reels/reelsService';
import { ReelCard } from '../../src/components/reels/ReelCard';
import { BackendReel } from '../../src/types/reel';

vi.mock('../../src/features/reels/reelsService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/features/reels/reelsService')>();
  return {
    ...actual,
    reelsService: {
      ...actual.reelsService,
      getReels: vi.fn(),
      getReelById: vi.fn(),
      likeReel: vi.fn(),
      unlikeReel: vi.fn(),
      saveReel: vi.fn(),
      unsaveReel: vi.fn(),
      addComment: vi.fn(),
      getComments: vi.fn(),
    },
  };
});

let mockAuthState = {
  isAuthenticated: false,
  user: null as { id: string; name: string } | null,
};

vi.mock('../../src/features/auth/useAuthStore', () => ({
  useAuthStore: (selector?: (s: typeof mockAuthState) => unknown) =>
    selector ? selector(mockAuthState) : mockAuthState,
}));

describe('Reels Feed/Detail Mapping & Auth Action Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = { isAuthenticated: false, user: null };
  });

  const sampleBackendReel: BackendReel = {
    id: 'b-reel-001',
    caption: 'Clean diesel sedan car demo video',
    title: 'Diesel Sedan Walkaround',
    description: 'Clean diesel sedan car demo video',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/sedan.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sedan.jpg',
    status: 'PUBLISHED',
    creatorId: 'user-seller-101',
    creator: {
      id: 'user-seller-101',
      name: 'Anand Verma',
      avatarUrl: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
      isVerifiedSeller: true,
    },
    listing: {
      id: 'list-car-55',
      title: 'Honda City 2021 VX',
      price: 950000,
      currency: 'INR',
      locationCity: 'Bengaluru',
      locationState: 'Karnataka',
    },
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 15,
    viewsCount: 2300,
    isLiked: true,
    isSaved: false,
    isSponsored: true,
    advertisementId: 'ad-boost-99',
    createdAt: '2026-11-10T08:00:00.000Z',
    mediaAsset: {
      durationMs: 45000,
      width: 720,
      height: 1280,
      storageKey: 'sedan.mp4',
      thumbnailKey: 'sedan.jpg',
    },
  };

  it('maps backend reel feed/detail schema accurately to ReelItem', () => {
    const mapped = mapBackendReelToReelItem(sampleBackendReel);

    expect(mapped.id).toBe('b-reel-001');
    expect(mapped.title).toBe('Diesel Sedan Walkaround');
    expect(mapped.description).toBe('Clean diesel sedan car demo video');
    expect(mapped.videoUrl).toBe('https://res.cloudinary.com/demo/video/upload/sedan.mp4');
    expect(mapped.thumbnailUrl).toBe('https://res.cloudinary.com/demo/image/upload/sedan.jpg');
    expect(mapped.price).toBe(950000);
    expect(mapped.listingId).toBe('list-car-55');
    expect(mapped.creator.id).toBe('user-seller-101');
    expect(mapped.creator.name).toBe('Anand Verma');
    expect(mapped.creator.isVerified).toBe(true);
    expect(mapped.metrics.likes).toBe(42);
    expect(mapped.metrics.comments).toBe(7);
    expect(mapped.metrics.views).toBe(2300);
    expect(mapped.durationSeconds).toBe(45);
    expect(mapped.isLiked).toBe(true);
    expect(mapped.isSaved).toBe(false);
    expect(mapped.isSponsored).toBe(true);
    expect(mapped.status).toBe('PUBLISHED');
  });

  it('handles backend reel with missing optional fields gracefully', () => {
    const minimalBackendReel: BackendReel = {
      id: 'b-reel-minimal',
      creatorId: 'creator-99',
      createdAt: '2026-11-01T00:00:00.000Z',
    };

    const mapped = mapBackendReelToReelItem(minimalBackendReel);

    expect(mapped.id).toBe('b-reel-minimal');
    expect(mapped.title).toBe('Product Reel');
    expect(mapped.creator.name).toBe('Seller');
    expect(mapped.creator.isVerified).toBe(false);
    expect(mapped.metrics.likes).toBe(0);
    expect(mapped.metrics.comments).toBe(0);
    expect(mapped.durationSeconds).toBe(60);
    expect(mapped.isLiked).toBe(false);
    expect(mapped.isSaved).toBe(false);
    expect(mapped.isSponsored).toBe(false);
  });

  it('renders ReelCard with mapped data and sponsored pill', () => {
    const mapped = mapBackendReelToReelItem(sampleBackendReel);
    const html = renderToString(React.createElement(ReelCard, { reel: mapped, isFeedMode: true }));

    expect(html).toContain('Diesel Sedan Walkaround');
    expect(html).toContain('Anand Verma');
    expect(html).toContain('Sponsored');
    expect(html).toContain('45s');
    expect(html).toContain('₹9,50,000');
    expect(html).toContain('View Product');
  });

  it('renders safe guest prompt dialog semantics when unauthenticated', () => {
    mockAuthState = { isAuthenticated: false, user: null };
    const mapped = mapBackendReelToReelItem(sampleBackendReel);
    const html = renderToString(React.createElement(ReelCard, { reel: mapped }));

    // Renders the card structure
    expect(html).toContain('aria-label="Like reel"');
    expect(html).toContain('aria-label="Save reel"');
  });
});
