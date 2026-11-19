import { apiClient } from '@/lib/api-client';

export type AdTargetType = 'LISTING' | 'REEL';
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';

export interface BoostPackage {
  id: string;
  name: string;
  durationDays: number;
  coinsCost: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Advertisement {
  id: string;
  ownerId: string;
  targetType: AdTargetType;
  targetId: string;
  title: string;
  status: AdStatus;
  packageId?: string | null;
  packageDays?: number | null;
  coinsSpent?: number | null;
  startDate: string;
  endDate?: string | null;
  stoppedAt?: string | null;
  package?: BoostPackage | null;
  listing?: {
    id: string;
    title: string;
    price: number;
    status?: string;
  } | null;
  reel?: {
    id: string;
    caption?: string | null;
    visibilityState?: string;
  } | null;
  createdAt: string;
}

export interface CreateBoostPayload {
  targetType: AdTargetType;
  targetId: string;
  packageId: string;
  idempotencyKey?: string;
}

export interface AdvertisementsListData {
  data: Advertisement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
}

export const boostService = {
  getPackages: async (): Promise<BoostPackage[]> => {
    const res = await apiClient.get<{ success: boolean; data: BoostPackage[] }>('/boost-packages');
    return res.data || [];
  },

  createBoost: async (payload: CreateBoostPayload): Promise<Advertisement> => {
    const body: Record<string, unknown> = {
      targetType: payload.targetType,
      targetId: payload.targetId,
      packageId: payload.packageId,
    };
    if (payload.idempotencyKey) {
      body.idempotencyKey = payload.idempotencyKey;
    }

    const res = await apiClient.post<{ success: boolean; data: Advertisement }>('/advertisements', body);
    return res.data;
  },

  getMyAdvertisements: async (query?: {
    status?: AdStatus;
    page?: number;
    limit?: number;
  }): Promise<AdvertisementsListData> => {
    const params: Record<string, unknown> = {};
    if (query?.status) params.status = query.status;
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const res = await apiClient.get<{
      success: boolean;
      data: Advertisement[];
      meta: AdvertisementsListData['meta'];
    }>('/advertisements', params);

    return { data: res.data || [], meta: res.meta };
  },

  cancelBoost: async (id: string): Promise<Advertisement> => {
    const res = await apiClient.post<{ success: boolean; data: Advertisement }>(
      `/advertisements/${encodeURIComponent(id)}/cancel`
    );
    return res.data;
  },

  pauseBoost: async (id: string): Promise<Advertisement> => {
    const res = await apiClient.post<{ success: boolean; data: Advertisement }>(
      `/advertisements/${encodeURIComponent(id)}/pause`
    );
    return res.data;
  },
};
