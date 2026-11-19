import { env } from './env';

/**
 * Share Links and Canonical URL Helpers for Bazarr 360
 * Standard Domain: https://bazarr360.in
 */

export function getBaseAppUrl(): string {
  return env.appUrl;
}

export function getListingCanonicalUrl(id: string): string {
  return `${getBaseAppUrl()}/listing/${encodeURIComponent(id)}`;
}

export function getReelCanonicalUrl(id: string): string {
  return `${getBaseAppUrl()}/reels/${encodeURIComponent(id)}`;
}

export function getCategoryCanonicalUrl(slug: string): string {
  return `${getBaseAppUrl()}/categories/${encodeURIComponent(slug)}`;
}

export function getProfileCanonicalUrl(id: string): string {
  return `${getBaseAppUrl()}/profile/${encodeURIComponent(id)}`;
}

export function getBusinessCanonicalUrl(slug: string): string {
  return `${getBaseAppUrl()}/business/${encodeURIComponent(slug)}`;
}

export interface ShareOptions {
  title: string;
  text?: string;
  url: string;
}

export async function shareContent(options: ShareOptions): Promise<{ shared: boolean; copied: boolean }> {
  const { title, text, url } = options;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text: text || title,
        url,
      });
      return { shared: true, copied: false };
    } catch (err: unknown) {
      // User cancelled share dialog
      if (err instanceof Error && err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  // Fallback to Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return { shared: false, copied: true };
    } catch {
      // Clipboard write failed
    }
  }

  return { shared: false, copied: false };
}
