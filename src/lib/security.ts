import { tokenStorage } from './token-storage';

/**
 * Security and Sanitization Utilities for Bazarr 360
 */

/**
 * Sanitizes redirect destination URLs to prevent Open Redirect vulnerabilities.
 * Only allows relative paths that start with a single '/' and do not start with '//'.
 */
export function sanitizeRedirectUrl(url: string | null | undefined, fallback = '/'): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Deny protocol-relative URLs (e.g. //attacker.com) and javascript: schemes
  if (trimmed.startsWith('//') || trimmed.includes('\\') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Must begin with single forward slash
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  return trimmed;
}

/**
 * Wipes all user-specific data, tokens, and caches on logout
 * to prevent stale authenticated data leaks.
 */
export function clearAllUserDataOnLogout(): void {
  // 1. Clear JWT tokens
  tokenStorage.clearTokens();

  // 2. Clear any cached user state or draft listings from localStorage/sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove = [
        'bazarr360_user_session',
        'bazarr360_draft_listing',
        'bazarr360_recent_searches',
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();
    } catch {
      // Storage access blocked or restricted
    }
  }
}
