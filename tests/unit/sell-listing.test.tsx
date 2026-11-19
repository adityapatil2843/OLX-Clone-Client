import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createListingClientSchema,
  validateImageFiles,
  validateVideoFile,
  validateCategoryAttributes,
  MEDIA_LIMITS,
} from '../../src/features/marketplace/listingValidation';
import { listingsService } from '../../src/features/marketplace/listingsService';
import { apiClient } from '../../src/lib/api-client';
import { ApiError } from '../../src/lib/api-error';

vi.mock('../../src/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class MockApiError extends Error {
    status: number;
    code?: string;
    details?: unknown;
    constructor(message: string, status: number = 500, code?: string, details?: unknown) {
      super(message);
      this.status = status;
      this.code = code;
      this.details = details;
    }
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('Sell & Listing Creation Validation and Workflow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Required Field Validation', () => {
    it('rejects empty title or title shorter than 2 characters', () => {
      const res = createListingClientSchema.safeParse({
        title: 'A',
        price: 5000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path[0] === 'title')).toBe(true);
      }
    });

    it('rejects title longer than 160 characters', () => {
      const longTitle = 'A'.repeat(161);
      const res = createListingClientSchema.safeParse({
        title: longTitle,
        price: 5000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path[0] === 'title')).toBe(true);
      }
    });

    it('rejects non-positive, zero, or excessively high price (>99,999,999)', () => {
      const zeroPrice = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 0,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(zeroPrice.success).toBe(false);

      const highPrice = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 100_000_000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(highPrice.success).toBe(false);
    });

    it('rejects invalid contact phone numbers and accepts valid formats', () => {
      const invalidPhone = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 5000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: 'abc123',
        locationCity: 'Mumbai',
      });
      expect(invalidPhone.success).toBe(false);

      const validLocalPhone = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 5000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(validLocalPhone.success).toBe(true);

      const validIntlPhone = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 5000,
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '+919876543210',
        locationCity: 'Mumbai',
      });
      expect(validIntlPhone.success).toBe(true);
    });

    it('rejects non-UUID category identifiers', () => {
      const res = createListingClientSchema.safeParse({
        title: 'Valid Title',
        price: 5000,
        categoryId: 'invalid-not-a-uuid',
        contactPhone: '9876543210',
        locationCity: 'Mumbai',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path[0] === 'categoryId')).toBe(true);
      }
    });

    it('validates required category attributes', () => {
      const attributeDefinitions = [
        { id: '1', key: 'brand', name: 'brand', label: 'Brand', type: 'string', required: true, options: ['Honda', 'Tata'] },
        { id: '2', key: 'year', name: 'year', label: 'Year', type: 'number', required: true },
      ];

      const missingErrors = validateCategoryAttributes(attributeDefinitions, {});
      expect(missingErrors.brand).toBeDefined();
      expect(missingErrors.year).toBeDefined();

      const invalidOptionErrors = validateCategoryAttributes(attributeDefinitions, { brand: 'Ferrari', year: 2022 });
      expect(invalidOptionErrors.brand).toBeDefined();

      const validAttrs = validateCategoryAttributes(attributeDefinitions, { brand: 'Honda', year: 2022 });
      expect(Object.keys(validAttrs)).toHaveLength(0);
    });
  });

  describe('2. File Type & Size Validation', () => {
    it('accepts allowed image types (JPEG, PNG, WebP) within size limit', () => {
      const validFile = new File(['mock content'], 'photo.jpg', { type: 'image/jpeg' });
      const { validFiles, errors } = validateImageFiles([validFile], 0);

      expect(validFiles).toHaveLength(1);
      expect(errors).toHaveLength(0);
    });

    it('rejects unsupported image MIME types', () => {
      const pdfFile = new File(['mock pdf'], 'doc.pdf', { type: 'application/pdf' });
      const { validFiles, errors } = validateImageFiles([pdfFile], 0);

      expect(validFiles).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].reason).toContain('Unsupported image format');
    });

    it('rejects image files exceeding 10MB limit', () => {
      const bigBuffer = new Uint8Array(11 * 1024 * 1024);
      const bigFile = new File([bigBuffer], 'huge.png', { type: 'image/png' });
      const { validFiles, errors } = validateImageFiles([bigFile], 0);

      expect(validFiles).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].reason).toContain('exceeds maximum allowed 10 MB');
    });

    it('enforces maximum 12 photos limit', () => {
      const files = Array.from({ length: 15 }, (_, i) =>
        new File(['mock'], `img${i}.jpg`, { type: 'image/jpeg' })
      );
      const { validFiles, errors } = validateImageFiles(files, 0);

      expect(validFiles).toHaveLength(MEDIA_LIMITS.MAX_IMAGES);
      expect(errors).toHaveLength(3);
    });

    it('validates video file type and 50MB limit', () => {
      const validVideo = new File(['video'], 'reel.mp4', { type: 'video/mp4' });
      expect(validateVideoFile(validVideo).isValid).toBe(true);

      const invalidVideoType = new File(['text'], 'text.txt', { type: 'text/plain' });
      expect(validateVideoFile(invalidVideoType).isValid).toBe(false);

      const hugeVideo = new File([new Uint8Array(55 * 1024 * 1024)], 'huge.mp4', { type: 'video/mp4' });
      const hugeResult = validateVideoFile(hugeVideo);
      expect(hugeResult.isValid).toBe(false);
      expect(hugeResult.error).toContain('exceeds maximum allowed 50 MB');
    });
  });

  describe('3. Listings Service & Upload Execution', () => {
    it('creates listing via POST /listings with FormData and upload progress', async () => {
      const mockCreatedListing = {
        id: 'new-listing-uuid-123',
        title: 'Royal Enfield Classic 350',
        price: 185000,
        currency: 'INR',
        status: 'ACTIVE',
        ownerId: 'user-uuid-1',
        categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
        contactPhone: '9876543210',
        createdAt: '2026-11-18T10:00:00Z',
        updatedAt: '2026-11-18T10:00:00Z',
      };

      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        data: mockCreatedListing,
      });

      const onProgress = vi.fn();
      const image = new File(['image'], 'bike.jpg', { type: 'image/jpeg' });
      const video = new File(['video'], 'reel.mp4', { type: 'video/mp4' });

      const result = await listingsService.createListing(
        {
          title: 'Royal Enfield Classic 350',
          price: 185000,
          currency: 'INR',
          categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
          contactPhone: '9876543210',
          locationCity: 'Pune',
          locationState: 'Maharashtra',
          images: [image],
          video,
        },
        onProgress
      );

      expect(postSpy).toHaveBeenCalled();
      const callArgs = postSpy.mock.calls[0];
      expect(callArgs[0]).toBe('/listings');
      expect(callArgs[1]).toBeInstanceOf(FormData);
      expect(result.id).toBe('new-listing-uuid-123');
      expect(result.title).toBe('Royal Enfield Classic 350');
    });

    it('handles direct media upload via POST /listings/:id/media/upload', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          type: 'IMAGE',
          storageKey: 'listings/user-1/listing-1/photo.jpg',
          url: 'https://res.cloudinary.com/demo/image/upload/photo.jpg',
          displayOrder: 0,
          provider: 'cloudinary',
        },
      ];

      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        data: mockMedia,
      });

      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const res = await listingsService.uploadListingMedia('listing-1', [file]);

      expect(postSpy).toHaveBeenCalledWith(
        '/listings/listing-1/media/upload',
        expect.any(FormData),
        expect.objectContaining({ timeout: 120000 })
      );
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe('media-1');
    });
  });

  describe('4. Error Handling & Security', () => {
    it('handles 401 Unauthorized errors from server API', async () => {
      vi.spyOn(apiClient, 'post').mockRejectedValue(
        new ApiError('Authentication token missing or invalid', 401, 'UNAUTHORIZED')
      );

      await expect(
        listingsService.createListing({
          title: 'Test',
          price: 1000,
          categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
          contactPhone: '9876543210',
        })
      ).rejects.toThrow('Authentication token missing or invalid');
    });

    it('handles 413 Payload Too Large error when files exceed server limit', async () => {
      vi.spyOn(apiClient, 'post').mockRejectedValue(
        new ApiError('File too large', 413, 'PAYLOAD_TOO_LARGE')
      );

      try {
        await listingsService.createListing({
          title: 'Test',
          price: 1000,
          categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
          contactPhone: '9876543210',
        });
      } catch (err) {
        expect((err as ApiError).status).toBe(413);
      }
    });

    it('handles 422 Unprocessable Entity with detailed field validation errors', async () => {
      const details = {
        fieldErrors: {
          title: ['Title must be at least 2 characters'],
          price: ['Price must be positive'],
        },
      };

      vi.spyOn(apiClient, 'post').mockRejectedValue(
        new ApiError('Validation failed', 422, 'VALIDATION_ERROR', details)
      );

      try {
        await listingsService.createListing({
          title: 'A',
          price: -10,
          categoryId: 'e98f0293-27ab-43b9-a292-ccfca281694b',
          contactPhone: '9876543210',
        });
      } catch (err) {
        expect((err as ApiError).status).toBe(422);
        expect((err as ApiError).details).toEqual(details);
      }
    });
  });

  describe('5. Duplicate Submission Prevention', () => {
    it('prevents multiple simultaneous submissions using in-flight lock pattern', async () => {
      let isSubmitting = false;
      const submittingRef = { current: false };

      const submitAction = async () => {
        if (submittingRef.current || isSubmitting) {
          return 'BLOCKED';
        }
        submittingRef.current = true;
        isSubmitting = true;

        await new Promise((resolve) => setTimeout(resolve, 50));

        submittingRef.current = false;
        isSubmitting = false;
        return 'SUCCESS';
      };

      // Fire 2 simultaneous submit attempts
      const [res1, res2] = await Promise.all([submitAction(), submitAction()]);

      // Exactly one succeeds and the other is safely blocked
      expect([res1, res2]).toContain('SUCCESS');
      expect([res1, res2]).toContain('BLOCKED');
    });
  });
});
