export type ListingCategory =
  | 'vehicles'
  | 'mobiles'
  | 'electronics'
  | 'properties'
  | 'furniture'
  | 'fashion'
  | 'jobs'
  | 'services'
  | 'other';

export type BackendListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED';

export type ListingStatus = BackendListingStatus | 'active' | 'sold' | 'expired' | 'under_review';

export interface BackendListingMedia {
  id: string;
  listingId?: string;
  type: 'IMAGE' | 'VIDEO';
  storageKey: string;
  thumbnailKey?: string | null;
  provider?: string;
  displayOrder: number;
  createdAt?: string;
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

export interface BackendListingLinkedReel {
  id: string;
  caption?: string | null;
  visibilityState?: string;
  status?: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt?: string;
}

export interface BackendListing {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  categoryId: string;
  contactPhone: string;
  status: BackendListingStatus;
  locationState?: string | null;
  locationCity?: string | null;
  locationLocality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  attributes?: Record<string, unknown> | null;
  ownerId?: string;
  owner?: BackendListingOwner;
  category?: BackendCategoryInfo;
  media?: BackendListingMedia[];
  reels?: BackendListingLinkedReel[];
  isWishlisted?: boolean;
  isSponsored?: boolean;
  advertisementId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  isPrimary?: boolean;
}

export interface ListingLocation {
  locality: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ListingSeller {
  id: string;
  name: string;
  avatarUrl?: string;
  isVerified: boolean;
  memberSince: string;
  phoneMasked?: string;
  rating?: number;
  totalListings?: number;
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  isNegotiable?: boolean;
  category: ListingCategory;
  subcategory?: string;
  media: ListingMedia[];
  location: ListingLocation;
  seller: ListingSeller;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
  isWishlisted?: boolean;
  attributes?: Record<string, string | number>;
  isLocalMock?: boolean;
  isSponsored?: boolean;
  advertisementId?: string;
}
