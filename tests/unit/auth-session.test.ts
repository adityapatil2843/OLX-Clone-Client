import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../../src/features/auth/useAuthStore';
import { authService, UserProfile } from '../../src/features/auth/authService';
import { tokenStorage } from '../../src/lib/token-storage';

const mockUser: UserProfile = {
  id: 'user-101',
  name: 'Test Seller',
  email: 'seller@example.com',
  isVerifiedSeller: true,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('Auth Session Lifecycle & Restoration (Journey C)', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    tokenStorage.clearTokens();
    vi.restoreAllMocks();
  });

  it('initializes with unauthenticated empty state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('sets authenticated session on login/setSession', () => {
    useAuthStore.getState().setSession(mockUser);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Test Seller');
    expect(state.user?.id).toBe('user-101');
  });

  it('restores authenticated user session via initAuth when token is present', async () => {
    tokenStorage.saveTokens('valid_access_token', 'valid_refresh_token');
    vi.spyOn(authService, 'getCurrentUser').mockResolvedValue(mockUser);

    await useAuthStore.getState().initAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('seller@example.com');
  });

  it('fails gracefully in initAuth when no session or server error occurs', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockResolvedValue(null);

    await useAuthStore.getState().initAuth();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('clears all session state and tokens on logout', async () => {
    useAuthStore.getState().setSession(mockUser);
    tokenStorage.saveTokens('token_to_clear');
    vi.spyOn(authService, 'logout').mockResolvedValue(undefined);

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(tokenStorage.getAccessToken()).toBeNull();
  });
});
