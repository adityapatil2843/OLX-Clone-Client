import { apiClient } from '@/lib/api-client';
import { BackendListing } from '@/types/listing';
import { PaginationMeta, PaginationQuery } from '@/types/api';

export interface WishlistListing extends BackendListing {
  savedAt: string;
}

export interface WishlistRecord {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface WishlistApiResponse {
  success: boolean;
  data: WishlistListing[];
  meta: PaginationMeta;
}

export const wishlistService = {
  getWishlist: async (
    query?: PaginationQuery
  ): Promise<{ data: WishlistListing[]; meta?: PaginationMeta }> => {
    const params: Record<string, unknown> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const res = await apiClient.get<WishlistApiResponse>('/wishlist', params);
    return { data: res.data || [], meta: res.meta };
  },

  addToWishlist: async (listingId: string): Promise<WishlistRecord> => {
    const res = await apiClient.post<{ success: boolean; data: WishlistRecord }>(
      `/wishlist/${encodeURIComponent(listingId)}`
    );
    return res.data;
  },

  removeFromWishlist: async (listingId: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ success: boolean; data: { message: string } }>(
      `/wishlist/${encodeURIComponent(listingId)}`
    );
    return res.data;
  },
};
