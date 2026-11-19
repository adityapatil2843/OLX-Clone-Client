import { apiClient } from '@/lib/api-client';
import { PaginationMeta, PaginationQuery } from '@/types/api';

export interface PublicUserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  role?: string;
  isVerifiedSeller: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ListUsersQuery extends PaginationQuery {
  search?: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  locationState?: string | null;
  locationCity?: string | null;
}

export interface UsersApiResponse {
  success: boolean;
  data: PublicUserProfile[];
  meta: PaginationMeta;
}

export const usersService = {
  getUsers: async (
    query?: ListUsersQuery
  ): Promise<{ data: PublicUserProfile[]; meta?: PaginationMeta }> => {
    const params: Record<string, unknown> = {};
    if (query?.search) params.search = query.search;
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const res = await apiClient.get<UsersApiResponse>('/users', params);
    return { data: res.data || [], meta: res.meta };
  },

  getUserProfile: async (userId: string): Promise<PublicUserProfile | null> => {
    try {
      const res = await apiClient.get<{ success: boolean; data: PublicUserProfile }>(
        `/users/${encodeURIComponent(userId)}`
      );
      return res.data;
    } catch {
      return null;
    }
  },

  updateProfile: async (
    userId: string,
    payload: UpdateUserProfilePayload,
    avatarFile?: File
  ): Promise<PublicUserProfile> => {
    if (avatarFile) {
      const formData = new FormData();
      if (payload.name) formData.append('name', payload.name);
      if (payload.bio !== undefined && payload.bio !== null) formData.append('bio', payload.bio);
      if (payload.locationState) formData.append('locationState', payload.locationState);
      if (payload.locationCity) formData.append('locationCity', payload.locationCity);
      formData.append('avatar', avatarFile);

      const res = await apiClient.patch<{ success: boolean; data: PublicUserProfile }>(
        `/users/${encodeURIComponent(userId)}/profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return res.data;
    }

    const res = await apiClient.patch<{ success: boolean; data: PublicUserProfile }>(
      `/users/${encodeURIComponent(userId)}/profile`,
      payload
    );
    return res.data;
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ success: boolean; data: { message: string } }>(
      `/users/${encodeURIComponent(userId)}`
    );
    return res.data;
  },
};
