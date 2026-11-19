export type BackendReelStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'ARCHIVED';

export interface BackendReelCreator {
  id: string;
  name: string;
  avatarUrl?: string | null;
  isVerifiedSeller?: boolean;
}

export interface BackendReelLinkedListing {
  id: string;
  title: string;
  price: number;
  currency?: string;
  locationCity?: string | null;
  locationState?: string | null;
}

export interface BackendReelMediaAsset {
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
  storageKey?: string | null;
  thumbnailKey?: string | null;
}

export interface BackendReelTaggedProduct {
  id: string;
  title: string;
  price: number;
}

export interface BackendReel {
  id: string;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  hashtags?: string[];
  status?: BackendReelStatus | string;
  visibilityState?: string;
  videoUrl?: string | null;
  hlsUrl?: string | null;
  thumbnailUrl?: string | null;
  customThumbnailUrl?: string | null;
  videoStorageKey?: string | null;
  thumbnailStorageKey?: string | null;
  videoProvider?: string | null;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
  creatorId: string;
  listingId?: string | null;
  categoryId?: string | null;
  locationText?: string | null;
  creator?: BackendReelCreator;
  listing?: BackendReelLinkedListing | null;
  mediaAsset?: BackendReelMediaAsset | null;
  taggedProducts?: BackendReelTaggedProduct[] | null;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  viewsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isSponsored?: boolean;
  advertisementId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReelCommentUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  user?: ReelCommentUser;
}

export interface ReelItem {
  id: string;
  videoUrl: string;
  hlsUrl?: string;
  thumbnailUrl: string;
  customThumbnailUrl?: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED' | 'PUBLISHED';
  processingError?: string;
  title: string;
  description?: string;
  price?: number;
  listingId?: string;
  creator: {
    id: string;
    name: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  metrics: {
    likes: number;
    views: number;
    shares: number;
    comments?: number;
  };
  durationSeconds: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isLocalMock?: boolean;
  isSponsored?: boolean;
  advertisementId?: string;
}
