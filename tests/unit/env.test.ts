import { describe, it, expect, vi } from 'vitest';
import { normalizeUrl, getClientEnv } from '../../src/lib/env';

describe('Environment Configuration & Safety', () => {
  it('falls back to safe defaults when variables are missing or blank', () => {
    const defaultUrl = 'https://bazarr360.in';
    expect(normalizeUrl(undefined, defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(normalizeUrl('', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(normalizeUrl('   ', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
  });

  it('normalizes trailing slashes on valid URLs', () => {
    const defaultUrl = 'https://bazarr360.in';
    expect(normalizeUrl('https://bazarr360.in/', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(normalizeUrl('https://bazarr360.in///', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(normalizeUrl('http://localhost:5000/api/v1/', 'http://localhost:5000/api/v1', 'TEST_URL')).toBe(
      'http://localhost:5000/api/v1'
    );
  });

  it('rejects invalid or missing protocol and returns safe default', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const defaultUrl = 'https://bazarr360.in';

    expect(normalizeUrl('bazarr360.in', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(normalizeUrl('ftp://bazarr360.in', defaultUrl, 'TEST_URL')).toBe('https://bazarr360.in');
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('returns valid ClientEnv object with required properties', () => {
    const envObj = getClientEnv();
    expect(envObj.appName).toBeDefined();
    expect(envObj.appUrl).toBe('https://bazarr360.in');
    expect(envObj.apiBaseUrl).toBeDefined();
    expect(typeof envObj.isProduction).toBe('boolean');
  });
});
