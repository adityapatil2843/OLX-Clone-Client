/**
 * Shared Type Definitions - Phase 1
 */

export * from './listing';
export * from './reel';
export * from './category';
export * from './api';

export type RouteCategory = 'public' | 'auth' | 'account' | 'admin';

export interface PlaceholderPageProps {
  title: string;
  description: string;
  category: RouteCategory;
  routePath: string;
  params?: Record<string, string>;
  plannedFeatures?: string[];
  quickLinks?: Array<{ href: string; label: string }>;
}
