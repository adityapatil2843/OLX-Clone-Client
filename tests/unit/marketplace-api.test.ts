import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  listingsService, 
  mapBackendListingToListingItem, 
  MAX_LISTING_LIMIT, 
  BackendListing 
} from '../../src/features/marketplace/listingsService';
import { categoriesService } from '../../src/features/marketplace/categoriesService';
import { apiClient } from '../../src/lib/api-client';
import { getFriendlyErrorMessage } from '../../src/components/ui/state-views';
import { ApiError } from '../../src/lib/api-error';

describe('Marketplace API Integration & Parameter Construction', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Search Parameter Construction & Bounded Pagination', () => {
    it('constructs correct search and filter query parameters', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });

      await listingsService.getListings({
        search: '  MacBook Pro  ',
        categoryId: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
        city: 'Mumbai',
        state: 'Maharashtra',
        minPrice: 50000,
        maxPrice: 150000,
        sortBy: 'price_asc',
        page: 2,
        limit: 15,
      });

      expect(getSpy).toHaveBeenCalledWith('/listings', {
        search: 'MacBook Pro',
        categoryId: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
        city: 'Mumbai',
        state: 'Maharashtra',
        minPrice: 50000,
        maxPrice: 150000,
        sortBy: 'price_asc',
        page: 2,
        limit: 15,
      });
    });

    it('enforces bounded limit (clamps to MAX_LISTING_LIMIT = 20) and ignores "All India" city', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });

      await listingsService.getListings({
        city: 'All India',
        limit: 100, // Client requests 100, server max limit is 20
        page: -5, // Invalid negative page
      });

      expect(getSpy).toHaveBeenCalledWith('/listings', {
        page: 1, // Normalized to min 1
        limit: MAX_LISTING_LIMIT, // Clamped to 20
      });
    });

    it('handles alternative "sort" parameter mapped to "sortBy"', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });

      await listingsService.getListings({
        sort: 'price_desc',
      });

      expect(getSpy).toHaveBeenCalledWith('/listings', {
        sortBy: 'price_desc',
      });
    });
  });

  describe('Category Filtering & Taxonomy Queries', () => {
    it('requests hierarchical tree format using query { tree: "true" }', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [
          {
            id: 'cat-uuid-1',
            name: 'Mobiles',
            slug: 'mobiles',
            children: [],
          },
        ],
      });

      const categories = await categoriesService.getCategories('tree');
      expect(getSpy).toHaveBeenCalledWith('/categories', { tree: 'true' });
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Mobiles');
    });

    it('retrieves category by slug with proper URI encoding', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: {
          id: 'cat-uuid-2',
          name: 'Cars & Bikes',
          slug: 'cars-bikes',
        },
      });

      const category = await categoriesService.getCategoryByIdOrSlug('cars-bikes');
      expect(getSpy).toHaveBeenCalledWith('/categories/cars-bikes');
      expect(category.id).toBe('cat-uuid-2');
    });
  });

  describe('Listing Detail Success & 404 / 422 Handling', () => {
    const mockBackendListing: BackendListing = {
      id: 'd9b3a011-4e20-4e1a-8bb7-09a25b29381c',
      title: 'Sony PlayStation 5 Console',
      description: 'Barely used PS5 with two DualSense controllers.',
      price: 38000,
      currency: 'INR',
      locationCity: 'Bangalore',
      locationState: 'Karnataka',
      locationLocality: 'Indiranagar',
      contactPhone: '+919876543210',
      status: 'ACTIVE',
      attributes: { Condition: 'Like New', Warranty: '6 Months' },
      createdAt: '2026-11-18T10:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z',
      ownerId: 'owner-uuid-1',
      categoryId: 'cat-uuid-3',
      owner: {
        id: 'owner-uuid-1',
        name: 'Arjun Mehta',
        avatarUrl: 'https://images.unsplash.com/avatar.jpg',
        isVerifiedSeller: true,
        phone: '+919876543210',
      },
      category: {
        id: 'cat-uuid-3',
        name: 'Electronics',
        slug: 'electronics',
      },
      media: [
        {
          id: 'media-1',
          type: 'IMAGE',
          storageKey: 'listings/ps5.jpg',
          url: 'https://res.cloudinary.com/ps5.jpg',
          thumbnailKey: 'https://res.cloudinary.com/ps5-thumb.jpg',
          provider: 'cloudinary',
          displayOrder: 0,
        },
      ],
      reels: [
        {
          id: 'reel-1',
          caption: 'PS5 boot demo',
          videoUrl: 'https://res.cloudinary.com/demo.mp4',
          thumbnailUrl: 'https://res.cloudinary.com/demo.jpg',
          status: 'PUBLISHED',
          createdAt: '2026-11-18T10:00:00Z',
        },
      ],
      isWishlisted: true,
      isSponsored: false,
    };

    it('loads listing by ID from API and maps accurately to ListingItem', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: mockBackendListing,
      });

      const listing = await listingsService.getListingById('d9b3a011-4e20-4e1a-8bb7-09a25b29381c');
      expect(listing.id).toBe('d9b3a011-4e20-4e1a-8bb7-09a25b29381c');

      const mapped = mapBackendListingToListingItem(listing);
      expect(mapped.id).toBe('d9b3a011-4e20-4e1a-8bb7-09a25b29381c');
      expect(mapped.title).toBe('Sony PlayStation 5 Console');
      expect(mapped.category).toBe('electronics');
      expect(mapped.seller.name).toBe('Arjun Mehta');
      expect(mapped.seller.isVerified).toBe(true);
      expect(mapped.media).toHaveLength(1);
      expect(mapped.media[0].isPrimary).toBe(true);
      expect(mapped.isLocalMock).toBe(false);
      expect(mapped.isWishlisted).toBe(true);
      expect(mapped.attributes).toEqual({ Condition: 'Like New', Warranty: '6 Months' });
    });

    it('rejects with ApiError when listing ID is not found (404)', async () => {
      vi.spyOn(apiClient, 'get').mockRejectedValue(
        new ApiError('Listing not found', 404, 'NOT_FOUND')
      );

      await expect(
        listingsService.getListingById('non-existent-uuid')
      ).rejects.toThrow('Listing not found');
    });
  });

  describe('Empty Results & Zero Mock Data Fallback', () => {
    it('returns empty array when API finds no matches without injecting mock listings', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0, hasNextPage: false },
      });

      const result = await listingsService.getListings({ search: 'NonExistentProductXYZ123' });
      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);

      const mapped = result.data.map(mapBackendListingToListingItem);
      expect(mapped).toEqual([]);
    });
  });

  describe('API Failure States & Error Normalization', () => {
    it('normalizes 404 Not Found into user-friendly message', () => {
      const err = new ApiError('Listing not found', 404, 'NOT_FOUND');
      const normalized = getFriendlyErrorMessage(err, 404);
      expect(normalized.isNotFound).toBe(true);
      expect(normalized.title).toBe('Item Not Found');
    });

    it('normalizes 422 Unprocessable Entity / Validation Error', () => {
      const err = new ApiError('maxPrice must be greater than or equal to minPrice', 422, 'VALIDATION_ERROR');
      const normalized = getFriendlyErrorMessage(err, 422);
      expect(normalized.title).toBe('Invalid Filter Parameters');
      expect(normalized.isNotFound).toBe(false);
    });

    it('normalizes 429 Too Many Requests (Rate Limit)', () => {
      const err = new ApiError('Too many requests', 429, 'TOO_MANY_REQUESTS');
      const normalized = getFriendlyErrorMessage(err, 429);
      expect(normalized.isRateLimited).toBe(true);
      expect(normalized.title).toBe('Too Many Requests');
    });

    it('normalizes network disconnect / timeout error', () => {
      const err = new Error('Network Error: ECONNREFUSED');
      const normalized = getFriendlyErrorMessage(err, 500);
      expect(normalized.isOffline).toBe(true);
      expect(normalized.title).toBe('Connection Problem');
    });

    it('normalizes unexpected 500 server error', () => {
      const err = new Error('Internal database failure');
      const normalized = getFriendlyErrorMessage(err, 500);
      expect(normalized.title).toBe('Something went wrong');
    });
  });
});
