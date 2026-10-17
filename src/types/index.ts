/**
 * Shared Type Definitions - Phase 0
 * Contains route metadata and placeholder page interfaces.
 */

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
