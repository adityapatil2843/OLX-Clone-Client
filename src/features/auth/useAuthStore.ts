'use client';

import { create } from 'zustand';
import { UserProfile, authService } from './authService';
import { clearAllUserDataOnLogout } from '@/lib/security';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: UserProfile) => void;
  clearSession: () => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (user: UserProfile) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  clearSession: () => {
    clearAllUserDataOnLogout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  logout: async () => {
    await authService.logout();
    clearAllUserDataOnLogout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
