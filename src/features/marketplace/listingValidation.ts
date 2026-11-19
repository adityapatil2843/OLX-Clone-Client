import { z } from 'zod';
import { CategoryAttribute } from './categoriesService';

export const MEDIA_LIMITS = {
  MAX_IMAGES: 12,
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/webm'],
};

export const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

export const createListingClientSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(160, 'Title cannot exceed 160 characters'),
  price: z.coerce
    .number()
    .positive('Price must be greater than 0')
    .max(99_999_999, 'Price cannot exceed ₹9,99,99,999'),
  currency: z.string().trim().toUpperCase().length(3).default('INR'),
  description: z.string().trim().max(5000, 'Description cannot exceed 5000 characters').optional(),
  categoryId: z.string().uuid('Please select a valid category'),
  locationCity: z.string().trim().min(1, 'City is required').max(100),
  locationState: z.string().trim().max(100).optional(),
  locationLocality: z.string().trim().max(150).optional(),
  contactPhone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Must be a valid phone number (e.g. 9876543210 or +919876543210)'),
});

export type ListingFormValues = z.infer<typeof createListingClientSchema>;

export interface MediaValidationError {
  file: File;
  reason: string;
}

/**
 * Validates selected image files against allowed MIME types and max size.
 */
export function validateImageFiles(
  files: File[],
  currentCount: number = 0
): { validFiles: File[]; errors: MediaValidationError[] } {
  const validFiles: File[] = [];
  const errors: MediaValidationError[] = [];

  for (const file of files) {
    if (currentCount + validFiles.length >= MEDIA_LIMITS.MAX_IMAGES) {
      errors.push({
        file,
        reason: `Maximum ${MEDIA_LIMITS.MAX_IMAGES} photos allowed per listing`,
      });
      continue;
    }

    if (!MEDIA_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.push({
        file,
        reason: `Unsupported image format (${file.type || 'unknown'}). Allowed: JPG, PNG, WebP`,
      });
      continue;
    }

    if (file.size > MEDIA_LIMITS.MAX_IMAGE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      errors.push({
        file,
        reason: `File "${file.name}" (${sizeMb} MB) exceeds maximum allowed 10 MB`,
      });
      continue;
    }

    validFiles.push(file);
  }

  return { validFiles, errors };
}

/**
 * Validates a video file for size and MIME type.
 */
export function validateVideoFile(file: File): { isValid: boolean; error?: string } {
  if (!MEDIA_LIMITS.ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported video format (${file.type || 'unknown'}). Allowed: MP4, MOV, WebM`,
    };
  }

  if (file.size > MEDIA_LIMITS.MAX_VIDEO_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Video (${sizeMb} MB) exceeds maximum allowed 50 MB`,
    };
  }

  return { isValid: true };
}

/**
 * Validates category dynamic attributes matching server validation logic.
 */
export function validateCategoryAttributes(
  definitions: CategoryAttribute[],
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!definitions || !Array.isArray(definitions) || definitions.length === 0) {
    return errors;
  }

  for (const def of definitions) {
    const val = values[def.key || def.name];
    const label = def.label || def.name || def.key;

    if (def.required && (val === undefined || val === null || val === '')) {
      errors[def.key || def.name] = `Please select or enter ${label}`;
      continue;
    }

    if (val !== undefined && val !== null && val !== '') {
      if (def.type === 'number') {
        const num = Number(val);
        if (Number.isNaN(num)) {
          errors[def.key || def.name] = `${label} must be a number`;
        }
      }

      if (def.options && Array.isArray(def.options) && def.options.length > 0) {
        if (!def.options.includes(String(val))) {
          errors[def.key || def.name] = `Invalid option for ${label}`;
        }
      }
    }
  }

  return errors;
}
