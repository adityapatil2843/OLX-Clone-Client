import { apiClient } from '@/lib/api-client';
import { BackendCategory, CategoryAttribute } from '@/types/category';
import { PaginationMeta, PaginationQuery } from '@/types/api';

export type { BackendCategory, CategoryAttribute } from '@/types/category';

export interface ListCategoriesQuery extends PaginationQuery {
  tree?: boolean;
  parentId?: string | null;
  includeInactive?: boolean;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: BackendCategory[];
  meta?: PaginationMeta | { totalRoots: number; totalCategories: number };
}

export const categoriesService = {
  getCategories: async (
    options: 'tree' | 'flat' | ListCategoriesQuery = 'tree'
  ): Promise<BackendCategory[]> => {
    const params: Record<string, unknown> = {};

    if (typeof options === 'string') {
      if (options === 'tree') {
        params.tree = 'true';
      }
    } else if (typeof options === 'object' && options !== null) {
      if (options.tree) params.tree = 'true';
      if (options.parentId !== undefined) {
        params.parentId = options.parentId === null ? 'root' : options.parentId;
      }
      if (options.includeInactive) params.includeInactive = 'true';
      if (options.page) params.page = options.page;
      if (options.limit) params.limit = options.limit;
    }

    const res = await apiClient.get<CategoriesApiResponse>('/categories', params);
    return res.data || [];
  },

  getCategoryByIdOrSlug: async (idOrSlug: string): Promise<BackendCategory> => {
    const res = await apiClient.get<{ success: boolean; data: BackendCategory }>(
      `/categories/${encodeURIComponent(idOrSlug)}`
    );
    return res.data;
  },

  getCategoryAttributes: async (idOrSlug: string): Promise<CategoryAttribute[]> => {
    const res = await apiClient.get<{
      success: boolean;
      data: { categoryId?: string; attributes?: CategoryAttribute[] } | CategoryAttribute[];
    }>(`/categories/${encodeURIComponent(idOrSlug)}/attributes`);

    if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      return res.data.attributes || [];
    }
    return Array.isArray(res.data) ? res.data : [];
  },
};
