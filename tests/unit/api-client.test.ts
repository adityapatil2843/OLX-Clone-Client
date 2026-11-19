import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../src/lib/api-error';
import { tokenStorage } from '../../src/lib/token-storage';
import { refreshCoordinator } from '../../src/lib/refresh-coordinator';

describe('API Infrastructure & Error Handling', () => {
  beforeEach(() => {
    tokenStorage.clearTokens();
  });

  it('instantiates ApiError with message, status, code, and retryAfter', () => {
    const error = new ApiError('Rate limit exceeded', 429, 'TOO_MANY_REQUESTS', null, '60');
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.status).toBe(429);
    expect(error.code).toBe('TOO_MANY_REQUESTS');
    expect(error.retryAfter).toBe('60');
    expect(error instanceof Error).toBe(true);
    expect(error instanceof ApiError).toBe(true);
  });

  it('normalizes unknown error into ApiError', () => {
    const nativeErr = new Error('Socket timeout');
    const normalized = ApiError.fromUnknown(nativeErr);
    expect(normalized).toBeInstanceOf(ApiError);
    expect(normalized.message).toBe('Socket timeout');
    expect(normalized.status).toBe(500);

    const stringErr = ApiError.fromUnknown('Random string');
    expect(stringErr).toBeInstanceOf(ApiError);
    expect(stringErr.status).toBe(500);
  });

  it('safely manages tokens in storage without leaking or throwing', () => {
    expect(tokenStorage.getAccessToken()).toBeNull();
    tokenStorage.saveTokens('mock_access_token', 'mock_refresh_token');
    expect(() => tokenStorage.clearTokens()).not.toThrow();
  });

  it('coordinates single-flight refresh without concurrent race conditions', async () => {
    const refreshFn = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return 'new_token_123';
    });

    const [res1, res2] = await Promise.all([
      refreshCoordinator.executeRefresh(refreshFn),
      refreshCoordinator.executeRefresh(refreshFn),
    ]);

    expect(res1).toBe('new_token_123');
    expect(res2).toBe('new_token_123');
    expect(refreshFn).toHaveBeenCalledTimes(1);
  });
});
