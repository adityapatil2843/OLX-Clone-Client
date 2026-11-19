import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeRedirectUrl, clearAllUserDataOnLogout } from '../../src/lib/security';
import { tokenStorage } from '../../src/lib/token-storage';

describe('Security & Logout Hardening', () => {
  beforeEach(() => {
    tokenStorage.clearTokens();
  });

  describe('sanitizeRedirectUrl', () => {
    it('allows valid relative paths', () => {
      expect(sanitizeRedirectUrl('/listing/123')).toBe('/listing/123');
      expect(sanitizeRedirectUrl('/chats')).toBe('/chats');
      expect(sanitizeRedirectUrl('/categories/vehicles')).toBe('/categories/vehicles');
    });

    it('denies protocol-relative URLs (open redirect attacks)', () => {
      expect(sanitizeRedirectUrl('//evil.com', '/')).toBe('/');
      expect(sanitizeRedirectUrl('//evil.com/phish', '/')).toBe('/');
    });

    it('denies absolute URLs with external domains', () => {
      expect(sanitizeRedirectUrl('https://evil.com', '/')).toBe('/');
      expect(sanitizeRedirectUrl('http://attacker.com/login', '/')).toBe('/');
    });

    it('denies javascript: or data: pseudo-protocols', () => {
      expect(sanitizeRedirectUrl('javascript:alert(1)', '/')).toBe('/');
      expect(sanitizeRedirectUrl('data:text/html,evil', '/')).toBe('/');
    });

    it('falls back to provided fallback or / when input is null/undefined/empty', () => {
      expect(sanitizeRedirectUrl(null, '/home')).toBe('/home');
      expect(sanitizeRedirectUrl(undefined, '/')).toBe('/');
      expect(sanitizeRedirectUrl('', '/fallback')).toBe('/fallback');
    });
  });

  describe('clearAllUserDataOnLogout', () => {
    it('completely clears tokens and user storage on logout', () => {
      tokenStorage.saveTokens('active_access_token', 'active_refresh_token');
      expect(tokenStorage.getAccessToken()).toBe('active_access_token');

      clearAllUserDataOnLogout();

      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });
  });
});
