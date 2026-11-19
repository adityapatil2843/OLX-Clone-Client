import { ListingCategory } from './listing';

export interface CategoryAttribute {
  id?: string;
  key?: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  parentId?: string | null;
  children?: BackendCategory[];
  displayOrder?: number;
  isActive?: boolean;
  attributes?: CategoryAttribute[] | Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    listings?: number;
  };
}

export interface CategoryItem {
  id: string;
  slug: ListingCategory;
  name: string;
  description: string;
  iconName: string;
  listingCount: number;
  popularSubcategories: string[];
}
