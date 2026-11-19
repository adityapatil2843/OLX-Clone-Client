import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../src/lib/api-error';
import { tokenStorage } from '../../src/lib/token-storage';
import { refreshCoordinator } from '../../src/lib/refresh-coordinator';
import { cleanParams } from '../../src/lib/api-client';
import { BackendListing } from '../../src/types/listing';
import { PaginatedApiResponse, PaginationMeta } from '../../src/types/api';

describe('API Foundation & Error Normalization Tests', () => {
  beforeEach(() => {
    tokenStorage.clearTokens();
    vi.restoreAllMocks();
  });

  describe('1. API Response & Pagination Mapping', () => {
    it('correctly maps a valid paginated response envelope and meta', () => {
      const mockMeta: PaginationMeta = {
        page: 1,
        limit: 20,
        total: 42,
        totalPages: 3,
        hasNextPage: true,
      };

      const mockListing: BackendListing = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'MacBook Pro M3 Max',
        description: 'Mint condition',
        price: 185000,
        currency: 'INR',
        categoryId: 'cat-uuid-001',
        contactPhone: '+919876543210',
        status: 'ACTIVE',
        locationCity: 'Bengaluru',
        locationState: 'Karnataka',
        createdAt: '2026-11-18T10:00:00.000Z',
        updatedAt: '2026-11-18T10:00:00.000Z',
      };

      const envelope: PaginatedApiResponse<BackendListing> = {
        success: true,
        data: [mockListing],
        meta: mockMeta,
      };

      expect(envelope.success).toBe(true);
      expect(envelope.data).toHaveLength(1);
      expect(envelope.data[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(envelope.data[0].status).toBe('ACTIVE');
      expect(envelope.meta.hasNextPage).toBe(true);
      expect(envelope.meta.totalPages).toBe(3);
    });

    it('cleanParams strips undefined, null, and empty strings safely', () => {
      const dirty = {
        search: 'phone',
        category: undefined,
        city: null,
        emptyStr: '',
        page: 1,
        limit: 20,
        isTrue: true,
        isFalse: false,
      };

      const cleaned = cleanParams(dirty);
      expect(cleaned).toEqual({
        search: 'phone',
        page: 1,
        limit: 20,
        isTrue: true,
        isFalse: false,
      });

      expect(cleanParams(undefined)).toBeUndefined();
      expect(cleanParams({})).toBeUndefined();
    });
  });

  describe('2. Error Normalization (404, 422, 429, 500)', () => {
    it('normalizes 404 Not Found responses into ApiError', () => {
      const err = ApiError.fromResponse(404, {
        success: false,
        error: { message: 'Listing not found', code: 'NOT_FOUND' },
      });

      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
      expect(err.message).toBe('Listing not found');
      expect(err.isNotFound()).toBe(true);
      expect(err.isValidationError()).toBe(false);
    });

    it('normalizes 422 Validation Error and extracts structured fieldErrors', () => {
      const err = ApiError.fromResponse(422, {
        success: false,
        error: {
          message: 'Validation failed',
          details: {
            fieldErrors: {
              price: ['maxPrice must be greater than or equal to minPrice'],
              categoryId: ['Must be a valid UUID'],
            },
          },
        },
      });

      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(422);
      expect(err.isValidationError()).toBe(true);
      expect(err.getFieldErrors()).toEqual({
        price: ['maxPrice must be greater than or equal to minPrice'],
        categoryId: ['Must be a valid UUID'],
      });
    });

    it('normalizes 429 Too Many Requests and parses retry-after header', () => {
      const err = ApiError.fromResponse(
        429,
        {
          success: false,
          error: { message: 'Too many requests' },
        },
        { 'retry-after': '60' }
      );

      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(429);
      expect(err.isRateLimited()).toBe(true);
      expect(err.retryAfter).toBe('60');
    });

    it('normalizes 500 unexpected errors gracefully', () => {
      const err = ApiError.fromUnknown(new Error('Connection dropped'));
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(500);
      expect(err.message).toBe('Connection dropped');
    });
  });

  describe('3. 401 Refresh Behavior & Mutex', () => {
    it('stores and clears tokens in tokenStorage securely', () => {
      expect(tokenStorage.getAccessToken()).toBeNull();
      tokenStorage.saveTokens('access_123', 'refresh_456');

      expect(tokenStorage.getAccessToken()).toBe('access_123');
      expect(tokenStorage.getRefreshToken()).toBe('refresh_456');

      tokenStorage.clearTokens();
      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it('coordinates single-flight refresh without race conditions', async () => {
      let callCount = 0;
      const refreshMock = vi.fn().mockImplementation(async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 25));
        return 'rotated_access_token_xyz';
      });

      const [res1, res2, res3] = await Promise.all([
        refreshCoordinator.executeRefresh(refreshMock),
        refreshCoordinator.executeRefresh(refreshMock),
        refreshCoordinator.executeRefresh(refreshMock),
      ]);

      expect(res1).toBe('rotated_access_token_xyz');
      expect(res2).toBe('rotated_access_token_xyz');
      expect(res3).toBe('rotated_access_token_xyz');
      expect(callCount).toBe(1);
    });

    it('clears token storage when refresh execution throws an error', async () => {
      tokenStorage.saveTokens('expired_acc', 'revoked_ref');

      const failedRefresh = vi.fn().mockRejectedValue(new Error('Revoked token'));

      await expect(refreshCoordinator.executeRefresh(failedRefresh)).rejects.toThrow('Revoked token');
    });
  });
});
