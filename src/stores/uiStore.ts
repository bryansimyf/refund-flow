import { create } from "zustand";

import type { AppError } from "@/types/appError";

type UiState = {
  loadingCount: number;
  isGlobalLoading: boolean;
  error: AppError | null;
  incrementLoading: () => void;
  decrementLoading: () => void;
  setError: (error: AppError) => void;
  clearError: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  loadingCount: 0,
  isGlobalLoading: false,
  error: null,
  incrementLoading: () =>
    set((state) => {
      const loadingCount = state.loadingCount + 1;

      return { loadingCount, isGlobalLoading: loadingCount > 0 };
    }),
  decrementLoading: () =>
    set((state) => {
      const loadingCount = Math.max(0, state.loadingCount - 1);

      return { loadingCount, isGlobalLoading: loadingCount > 0 };
    }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
