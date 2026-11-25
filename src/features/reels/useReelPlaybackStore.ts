'use client';

import { create } from 'zustand';

interface ReelPlaybackState {
  activePlayerId: string | null;
  setActivePlayer: (id: string | null) => void;
  pauseAll: () => void;
}

export const useReelPlaybackStore = create<ReelPlaybackState>((set) => ({
  activePlayerId: null,
  setActivePlayer: (id: string | null) => set({ activePlayerId: id }),
  pauseAll: () => set({ activePlayerId: null }),
}));
