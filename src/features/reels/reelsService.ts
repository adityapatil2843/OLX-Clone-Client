import { apiClient } from '@/lib/api-client';
import {
  BackendReel,
  BackendReelStatus,
  ReelComment,
  ReelItem,
} from '@/types/reel';
import { PaginationMeta, PaginationQuery } from '@/types/api';

export type {
  BackendReel,
  BackendReelCreator,
  BackendReelLinkedListing,
  BackendReelStatus,
  ReelComment,
  ReelItem,
} from '@/types/reel';

export function mapBackendReelToReelItem(reel: BackendReel): ReelItem {
  const durationSeconds = reel.mediaAsset?.durationMs
    ? Math.round(reel.mediaAsset.durationMs / 1000)
    : (reel.durationMs ? Math.round(reel.durationMs / 1000) : 60);

  const primaryListing = reel.listing || (reel.taggedProducts && reel.taggedProducts[0]) || null;

  return {
    id: reel.id,
    videoUrl: reel.videoUrl || '',
    hlsUrl: reel.hlsUrl || undefined,
    thumbnailUrl: reel.thumbnailUrl || reel.customThumbnailUrl || '',
    customThumbnailUrl: reel.customThumbnailUrl || reel.thumbnailUrl || undefined,
    status: (reel.status === 'PUBLISHED' ? 'PUBLISHED' : (reel.status as ReelItem['status'])) || 'READY',
    title: reel.title || reel.caption || primaryListing?.title || 'Product Reel',
    description: reel.description || reel.caption || undefined,
    price: primaryListing?.price ?? undefined,
    listingId: primaryListing?.id || reel.listingId || undefined,
    creator: {
      id: reel.creator?.id || reel.creatorId || '',
      name: reel.creator?.name || 'Seller',
      avatarUrl: reel.creator?.avatarUrl || undefined,
      isVerified: Boolean(reel.creator?.isVerifiedSeller),
    },
    metrics: {
      likes: reel.likesCount ?? 0,
      views: reel.viewsCount ?? 0,
      shares: reel.sharesCount ?? 0,
      comments: reel.commentsCount ?? 0,
    },
    durationSeconds: durationSeconds > 0 ? durationSeconds : 60,
    createdAt: reel.createdAt || new Date().toISOString(),
    isLiked: Boolean(reel.isLiked),
    isSaved: Boolean(reel.isSaved),
    isSponsored: Boolean(reel.isSponsored),
    advertisementId: reel.advertisementId,
  };
}

export interface ListReelsQuery extends PaginationQuery {
  creatorId?: string;
  categoryId?: string;
  listingId?: string;
  status?: string;
  cursor?: string;
}

export interface CreateReelPayload {
  caption?: string;
  hashtags?: string[];
  categoryId?: string | null;
  locationText?: string | null;
  listingId?: string | null;
  videoStorageKey?: string | null;
  thumbnailStorageKey?: string | null;
  videoProvider?: string | null;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface UpdateReelPayload {
  caption?: string;
  hashtags?: string[];
  categoryId?: string | null;
  locationText?: string | null;
  listingId?: string | null;
  status?: BackendReelStatus;
}

export interface ReelUploadUrlPayload {
  fileName?: string;
  fileType?: string;
  fileSizeBytes?: number;
}

export interface ReelConfirmUploadPayload {
  videoStorageKey?: string;
  thumbnailStorageKey?: string | null;
  videoProvider?: string;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
}

export type ListCommentsQuery = PaginationQuery;

export interface ReelsApiResponse {
  success: boolean;
  data: BackendReel[];
  meta: PaginationMeta;
}

export interface CommentsApiResponse {
  success: boolean;
  data: ReelComment[];
  meta: PaginationMeta;
}

export const reelsService = {
  getReels: async (
    query?: ListReelsQuery
  ): Promise<{ data: BackendReel[]; meta?: PaginationMeta }> => {
    const params: Record<string, unknown> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.creatorId) params.creatorId = query.creatorId;
    if (query?.categoryId) params.categoryId = query.categoryId;
    if (query?.listingId) params.listingId = query.listingId;
    if (query?.status) params.status = query.status;
    if (query?.cursor) params.cursor = query.cursor;

    const res = await apiClient.get<ReelsApiResponse>('/reels', params);
    return { data: res.data || [], meta: res.meta };
  },

  getReelById: async (id: string): Promise<BackendReel> => {
    const res = await apiClient.get<{ success: boolean; data: BackendReel }>(
      `/reels/${encodeURIComponent(id)}`
    );
    return res.data;
  },

  createReel: async (payload: CreateReelPayload): Promise<BackendReel> => {
    const res = await apiClient.post<{ success: boolean; data: BackendReel }>(
      '/reels',
      payload
    );
    return res.data;
  },

  updateReel: async (
    reelId: string,
    payload: UpdateReelPayload
  ): Promise<BackendReel> => {
    const res = await apiClient.patch<{ success: boolean; data: BackendReel }>(
      `/reels/${encodeURIComponent(reelId)}`,
      payload
    );
    return res.data;
  },

  deleteReel: async (reelId: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ success: boolean; data: { message: string } }>(
      `/reels/${encodeURIComponent(reelId)}`
    );
    return res.data;
  },

  requestUploadUrl: async (
    reelId: string,
    payload?: ReelUploadUrlPayload
  ): Promise<Record<string, unknown>> => {
    const res = await apiClient.post<{ success: boolean; data: Record<string, unknown> }>(
      `/reels/${encodeURIComponent(reelId)}/upload-url`,
      payload || {}
    );
    return res.data;
  },

  confirmUpload: async (
    reelId: string,
    payload: ReelConfirmUploadPayload
  ): Promise<BackendReel> => {
    const res = await apiClient.post<{ success: boolean; data: BackendReel }>(
      `/reels/${encodeURIComponent(reelId)}/confirm-upload`,
      payload
    );
    return res.data;
  },

  cancelUpload: async (reelId: string): Promise<{ message?: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message?: string } }>(
      `/reels/${encodeURIComponent(reelId)}/cancel-upload`
    );
    return res.data;
  },

  likeReel: async (id: string): Promise<{ liked: boolean; message?: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message?: string; reelId?: string } }>(
      `/reels/${encodeURIComponent(id)}/like`
    );
    return { liked: true, message: res.data?.message };
  },

  unlikeReel: async (id: string): Promise<{ liked: boolean; message?: string }> => {
    const res = await apiClient.delete<{ success: boolean; data: { message?: string; reelId?: string } }>(
      `/reels/${encodeURIComponent(id)}/like`
    );
    return { liked: false, message: res.data?.message };
  },

  saveReel: async (id: string): Promise<{ saved: boolean; message?: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message?: string; reelId?: string } }>(
      `/reels/${encodeURIComponent(id)}/save`
    );
    return { saved: true, message: res.data?.message };
  },

  unsaveReel: async (id: string): Promise<{ saved: boolean; message?: string }> => {
    const res = await apiClient.delete<{ success: boolean; data: { message?: string; reelId?: string } }>(
      `/reels/${encodeURIComponent(id)}/save`
    );
    return { saved: false, message: res.data?.message };
  },

  getComments: async (
    reelId: string,
    query?: ListCommentsQuery
  ): Promise<{ data: ReelComment[]; meta?: PaginationMeta }> => {
    const params: Record<string, unknown> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const res = await apiClient.get<CommentsApiResponse>(
      `/reels/${encodeURIComponent(reelId)}/comments`,
      params
    );
    return { data: res.data || [], meta: res.meta };
  },

  addComment: async (reelId: string, text: string): Promise<ReelComment> => {
    const res = await apiClient.post<{ success: boolean; data: ReelComment }>(
      `/reels/${encodeURIComponent(reelId)}/comments`,
      { text: text.trim() }
    );
    return res.data;
  },
};
