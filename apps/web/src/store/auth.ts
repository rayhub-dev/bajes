import { type SessionDTO, type UserDTO } from "@bajes/types";
import { create } from "zustand";

export interface AuthState {
  user: UserDTO | null;
  session: SessionDTO | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: UserDTO | null) => void;
  setSession: (session: SessionDTO | null) => void;
  setAuth: (user: UserDTO | null, session: SessionDTO | null) => void;
  setIsInitializing: (value: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: Boolean(user && state.session),
    })),
  setSession: (session) =>
    set((state) => ({
      session,
      isAuthenticated: Boolean(state.user && session),
    })),
  setAuth: (user, session) =>
    set({
      user,
      session,
      isAuthenticated: Boolean(user && session),
    }),
  setIsInitializing: (value) =>
    set({
      isInitializing: value,
    }),
  resetAuth: () =>
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
}));
