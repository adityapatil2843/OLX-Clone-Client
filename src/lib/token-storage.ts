/**
 * Safe Browser Token Storage
 * Manages JWT access and refresh tokens securely in client-side storage.
 * Never logs or exposes tokens in URLs, console, or analytics.
 */

const ACCESS_TOKEN_KEY = 'bazarr360_access_token';
const REFRESH_TOKEN_KEY = 'bazarr360_refresh_token';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  saveTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Storage error
    }
  },
};
