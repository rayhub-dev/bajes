import { create } from "zustand";

export interface UIState {
  isOnline: boolean;
  isSyncing: boolean;
  isGlobalLoading: boolean;
  activeModal: string | null;
  setOnlineStatus: (value: boolean) => void;
  setSyncing: (value: boolean) => void;
  setGlobalLoading: (value: boolean) => void;
  openModal: (modalKey: string) => void;
  closeModal: () => void;
  resetUiState: () => void;
}

const initialUiState = {
  isOnline: true,
  isSyncing: false,
  isGlobalLoading: false,
  activeModal: null,
} satisfies Pick<UIState, "isOnline" | "isSyncing" | "isGlobalLoading" | "activeModal">;

export const useUiStore = create<UIState>((set) => ({
  ...initialUiState,
  setOnlineStatus: (value) =>
    set({
      isOnline: value,
    }),
  setSyncing: (value) =>
    set({
      isSyncing: value,
    }),
  setGlobalLoading: (value) =>
    set({
      isGlobalLoading: value,
    }),
  openModal: (modalKey) =>
    set({
      activeModal: modalKey,
    }),
  closeModal: () =>
    set({
      activeModal: null,
    }),
  resetUiState: () =>
    set({
      ...initialUiState,
    }),
}));
