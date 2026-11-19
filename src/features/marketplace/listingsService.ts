import { apiClient } from '@/lib/api-client';
import { ListingItem, ListingCategory, ListingMedia, ListingStatus } from '@/types/listing';

export interface BackendListingMedia {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  storageKey: string;
  thumbnailKey?: string | null;
  provider?: string;
  displayOrder: number;
  url?: string;
}

export interface BackendListingOwner {
  id: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  isVerifiedSeller?: boolean;
}

export interface BackendCategoryInfo {
  id: string;
  name: string;
  slug: string;
  attributes?: unknown;
}

export interface BackendListingReel {
  id: string;
  caption?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt?: string;
  status?: string;
}

export interface BackendListing {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  locationCity?: string | null;
  locationState?: string | null;
  locationLocality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone: string;
  status: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'ARCHIVED';
  attributes?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  categoryId?: string;
  owner?: BackendListingOwner;
  category?: BackendCategoryInfo;
  media?: BackendListingMedia[];
  reels?: BackendListingReel[];
  isWishlisted?: boolean;
  isSponsored?: boolean;
  advertisementId?: string;
}

export interface ListListingsQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'distance';
  page?: number;
  limit?: number;
}

export interface ListingsApiResponse {
  success: boolean;
  data: BackendListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
}

export interface CreateListingPayload {
  title: string;
  price: number;
  currency?: string;
  description?: string;
  categoryId: string;
  locationState?: string;
  locationCity?: string;
  locationLocality?: string;
  latitude?: number;
  longitude?: number;
  contactPhone: string;
  status?: 'DRAFT' | 'ACTIVE';
  attributes?: Record<string, unknown>;
  images?: File[];
  video?: File | null;
}

export const MAX_LISTING_LIMIT = 20;

export const listingsService = {
  createListing: async (
    payload: CreateListingPayload | FormData,
    onUploadProgress?: (percent: number) => void
  ): Promise<BackendListing> => {
    let body: FormData;
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      body = payload;
    } else {
      const p = payload as CreateListingPayload;
      const formData = new FormData();
      formData.append('title', p.title);
      formData.append('price', String(p.price));
      formData.append('currency', p.currency || 'INR');
      formData.append('categoryId', p.categoryId);
      formData.append('contactPhone', p.contactPhone);
      formData.append('status', p.status || 'ACTIVE');

      if (p.description) formData.append('description', p.description);
      if (p.locationState) formData.append('locationState', p.locationState);
      if (p.locationCity) formData.append('locationCity', p.locationCity);
      if (p.locationLocality) formData.append('locationLocality', p.locationLocality);
      if (p.latitude !== undefined) formData.append('latitude', String(p.latitude));
      if (p.longitude !== undefined) formData.append('longitude', String(p.longitude));
      if (p.attributes) formData.append('attributes', JSON.stringify(p.attributes));

      if (p.images && p.images.length > 0) {
        for (const file of p.images) {
          formData.append('images', file);
        }
      }

      if (p.video) {
        formData.append('file', p.video);
      }

      body = formData;
    }

    const res = await apiClient.post<{ success: boolean; data: BackendListing }>(
      '/listings',
      body,
      {
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onUploadProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percent);
          }
        },
      }
    );

    return res.data;
  },

  uploadListingMedia: async (
    listingId: string,
    files: File[],
    onUploadProgress?: (percent: number) => void
  ): Promise<BackendListingMedia[]> => {
    const formData = new FormData();
    for (const file of files) {
      if (file.type.startsWith('video/')) {
        formData.append('video', file);
      } else {
        formData.append('images', file);
      }
    }

    const res = await apiClient.post<{ success: boolean; data: BackendListingMedia[] | BackendListingMedia }>(
      `/listings/${encodeURIComponent(listingId)}/media/upload`,
      formData,
      {
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onUploadProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percent);
          }
        },
      }
    );

    const data = res.data;
    return Array.isArray(data) ? data : [data];
  },
  getListings: async (
    query?: ListListingsQuery
  ): Promise<{ data: BackendListing[]; meta: ListingsApiResponse['meta'] }> => {
    const params: Record<string, unknown> = {};
    if (query?.search?.trim()) params.search = query.search.trim();
    if (query?.categoryId) params.categoryId = query.categoryId;
    if (query?.minPrice !== undefined && !Number.isNaN(query.minPrice)) params.minPrice = query.minPrice;
    if (query?.maxPrice !== undefined && !Number.isNaN(query.maxPrice)) params.maxPrice = query.maxPrice;
    if (query?.city && query.city !== 'All India') params.city = query.city;
    if (query?.state) params.state = query.state;
    if (query?.sortBy) params.sortBy = query.sortBy;
    else if (query?.sort) params.sortBy = query.sort;
    if (query?.page) params.page = Math.max(1, query.page);
    if (query?.limit !== undefined) {
      params.limit = Math.min(Math.max(1, query.limit), MAX_LISTING_LIMIT);
    }

    const res = await apiClient.get<ListingsApiResponse>('/listings', params);
    return { data: res.data || [], meta: res.meta };
  },

  getListingById: async (id: string): Promise<BackendListing> => {
    const res = await apiClient.get<{ success: boolean; data: BackendListing }>(
      `/listings/${encodeURIComponent(id)}`
    );
    if ('data' in res && res.data) {
      return res.data;
    }
    return res as unknown as BackendListing;
  },

  getMyListings: async (
    page = 1,
    limit = 20
  ): Promise<{ data: BackendListing[]; meta: ListingsApiResponse['meta'] }> => {
    const res = await apiClient.get<ListingsApiResponse>('/listings/mine', { page, limit });
    return { data: res.data || [], meta: res.meta };
  },
};

/**
 * Maps backend API listing to the client ListingItem schema.
 * Preserves responsive UI contracts, image URLs, and seller badges.
 */
export function mapBackendListingToListingItem(item: BackendListing): ListingItem {
  const mediaList: ListingMedia[] =
    item.media && item.media.length > 0
      ? item.media.map((m) => ({
          id: m.id,
          url: m.url || m.thumbnailKey || '',
          thumbnailUrl: m.thumbnailKey || m.url || '',
          type: m.type?.toLowerCase() === 'video' ? 'video' : 'image',
          isPrimary: m.displayOrder === 0,
        }))
      : [];

  const rawAttributes = item.attributes || {};
  const normalizedAttributes: Record<string, string | number> = {};
  if (typeof rawAttributes === 'object' && rawAttributes !== null) {
    for (const [key, val] of Object.entries(rawAttributes)) {
      if (typeof val === 'string' || typeof val === 'number') {
        normalizedAttributes[key] = val;
      }
    }
  }

  const categorySlug = (item.category?.slug || 'other') as ListingCategory;
  const statusLower = (item.status ? item.status.toLowerCase() : 'active') as ListingStatus;

  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    price: item.price,
    isNegotiable: Boolean(
      item.attributes && (item.attributes as Record<string, unknown>).isNegotiable
    ),
    category: categorySlug,
    subcategory: item.category?.name || undefined,
    media: mediaList,
    location: {
      locality: item.locationLocality || '',
      city: item.locationCity || '',
      state: item.locationState || '',
      latitude:
        item.latitude !== null && item.latitude !== undefined ? Number(item.latitude) : undefined,
      longitude:
        item.longitude !== null && item.longitude !== undefined ? Number(item.longitude) : undefined,
    },
    seller: {
      id: item.owner?.id || item.ownerId || '',
      name: item.owner?.name || 'Verified Seller',
      avatarUrl: item.owner?.avatarUrl || undefined,
      isVerified: Boolean(item.owner?.isVerifiedSeller),
      memberSince: 'Member',
      phoneMasked: item.contactPhone
        ? item.contactPhone.slice(0, 6) + '•••••'
        : item.owner?.phone
        ? item.owner.phone.slice(0, 6) + '•••••'
        : undefined,
    },
    status: statusLower,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    isWishlisted: Boolean(item.isWishlisted),
    isSponsored: Boolean(item.isSponsored),
    advertisementId: item.advertisementId,
    attributes: normalizedAttributes,
    isLocalMock: false,
  };
}
