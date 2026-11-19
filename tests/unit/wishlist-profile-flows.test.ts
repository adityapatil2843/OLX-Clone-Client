import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { wishlistService } from '../../src/features/marketplace/wishlistService';
import { mapBackendListingToListingItem } from '../../src/features/marketplace/listingsService';
import { ProfileView } from '../../src/components/profile/ProfileView';
import { ErrorState } from '../../src/components/ui/state-views';
import { BackendListing } from '../../src/types/listing';

vi.mock('../../src/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../src/features/auth/useAuthStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

describe('Wishlist & Profile Production Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleBackendListing: BackendListing = {
    id: 'listing-phone-001',
    title: 'OnePlus 12 256GB Silky Black',
    description: 'Mint condition with bill and fast charger.',
    price: 48000,
    currency: 'INR',
    categoryId: 'cat-mobiles',
    contactPhone: '+919876543210',
    status: 'ACTIVE',
    locationCity: 'Hyderabad',
    locationState: 'Telangana',
    locationLocality: 'Hitec City',
    ownerId: 'user-seller-hyderabad',
    owner: {
      id: 'user-seller-hyderabad',
      name: 'Kiran Rao',
      avatarUrl: null,
      isVerifiedSeller: true,
    },
    category: {
      id: 'cat-mobiles',
      name: 'Mobile Phones',
      slug: 'mobiles',
    },
    media: [
      {
        id: 'media-01',
        type: 'IMAGE',
        storageKey: 'listings/user-seller-hyderabad/listing-phone-001/photo1',
        thumbnailKey: 'https://res.cloudinary.com/demo/image/upload/photo1.jpg',
        provider: 'cloudinary',
        displayOrder: 0,
      },
    ],
    isWishlisted: true,
    createdAt: '2026-11-05T12:00:00.000Z',
    updatedAt: '2026-11-05T12:00:00.000Z',
  };

  it('correctly maps backend listing to client ListingItem schema', () => {
    const item = mapBackendListingToListingItem(sampleBackendListing);

    expect(item.id).toBe('listing-phone-001');
    expect(item.title).toBe('OnePlus 12 256GB Silky Black');
    expect(item.price).toBe(48000);
    expect(item.category).toBe('mobiles');
    expect(item.location.city).toBe('Hyderabad');
    expect(item.location.state).toBe('Telangana');
    expect(item.seller.name).toBe('Kiran Rao');
    expect(item.seller.isVerified).toBe(true);
    expect(item.isWishlisted).toBe(true);
    expect(item.media.length).toBe(1);
    expect(item.media[0].url).toBe('https://res.cloudinary.com/demo/image/upload/photo1.jpg');
  });

  it('wishlistService handles addToWishlist and removeFromWishlist calls', async () => {
    const { apiClient } = await import('../../src/lib/api-client');

    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: 'wish-1', userId: 'user-1', listingId: 'listing-phone-001', createdAt: '2026-11-18' },
    });

    (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { message: 'Listing removed from wishlist' },
    });

    const addRes = await wishlistService.addToWishlist('listing-phone-001');
    expect(addRes.listingId).toBe('listing-phone-001');
    expect(apiClient.post).toHaveBeenCalledWith('/wishlist/listing-phone-001');

    const removeRes = await wishlistService.removeFromWishlist('listing-phone-001');
    expect(removeRes.message).toBe('Listing removed from wishlist');
    expect(apiClient.delete).toHaveBeenCalledWith('/wishlist/listing-phone-001');
  });

  it('renders public profile without fake ratings, reviews, followers, or analytics', () => {
    const realUser = {
      id: 'user-real-99',
      name: 'Sunita Sharma',
      avatarUrl: null,
      bio: 'Private seller from Jaipur offering home furniture.',
      locationCity: 'Jaipur',
      locationState: 'Rajasthan',
      isVerifiedSeller: true,
      createdAt: '2024-05-15T00:00:00.000Z',
    };

    const html = renderToString(
      React.createElement(ProfileView, {
        user: realUser,
        listings: [],
        reels: [],
      })
    );

    expect(html).toContain('Sunita Sharma');
    expect(html).toContain('Verified Seller');
    expect(html).toContain('Jaipur, Rajasthan');
    expect(html).toContain('Active Listings (0)');
    expect(html).toContain('Product Reels (0)');

    // Ensure NO fake metrics
    expect(html).not.toContain('4.9 / 5.0');
    expect(html).not.toContain('Reviews');
    expect(html).not.toContain('Followers');
    expect(html).not.toContain('Analytics');
    expect(html).not.toContain('Rating');
  });

  it('renders business storefront with business badge and NO fake metrics', () => {
    const businessUser = {
      id: 'biz-delhi-auto',
      name: 'Delhi Auto Hub',
      avatarUrl: null,
      bio: 'Commercial dealership offering verified pre-owned cars.',
      locationCity: 'New Delhi',
      locationState: 'Delhi',
      isVerifiedSeller: true,
      createdAt: '2023-11-20T00:00:00.000Z',
    };

    const html = renderToString(
      React.createElement(ProfileView, {
        user: businessUser,
        listings: [],
        reels: [],
        isBusiness: true,
        canonicalUrl: 'https://bazarr360.in/business/delhi-auto-hub',
      })
    );

    expect(html).toContain('Delhi Auto Hub');
    expect(html).toContain('Verified Business');
    expect(html).toContain('Business Storefront');

    // Ensure NO fake metrics
    expect(html).not.toContain('4.9 / 5.0');
    expect(html).not.toContain('Reviews');
    expect(html).not.toContain('Followers');
    expect(html).not.toContain('Analytics');
  });

  it('renders clean 404 state for missing or deleted user profile', () => {
    const html = renderToString(
      React.createElement(ErrorState, {
        status: 404,
        title: 'Seller Profile Not Found',
        description: "We could not find a seller account for 'missing-user-id'. This account may have been deleted or deactivated.",
      })
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Seller Profile Not Found');
    expect(html).toContain('missing-user-id');
  });

  it('renders clean 404 state for missing reel', () => {
    const html = renderToString(
      React.createElement(ErrorState, {
        status: 404,
        title: 'Product Reel Not Found',
        description: "We could not find reel 'missing-reel-123'. It may have expired or been deleted by the creator.",
      })
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Product Reel Not Found');
    expect(html).toContain('missing-reel-123');
  });

  it('renders clean 404 state for missing business storefront', () => {
    const html = renderToString(
      React.createElement(ErrorState, {
        status: 404,
        title: 'Business Storefront Not Found',
        description: "We could not find a verified business storefront for 'nonexistent-business'.",
      })
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Business Storefront Not Found');
    expect(html).toContain('nonexistent-business');
  });
});
