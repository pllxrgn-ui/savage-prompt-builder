import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isPro: boolean;
  isAuthenticated: boolean;
  devMode: boolean;
}

interface AuthActions {
  login: (user: AuthUser) => void;
  logout: () => void;
  setDevMode: (on: boolean) => void;
  setPro: (isPro: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

const DEV_USER: AuthUser = {
  id: "admin-001",
  name: "Admin",
  email: "admin@savage.app",
  avatarUrl: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: DEV_USER,
      isPro: true,
      isAuthenticated: true,
      devMode: true,

      // BACKEND: Replace with real Supabase Auth session check
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isPro: false,
          isAuthenticated: false,
          devMode: false,
        }),

      setDevMode: (on) =>
        set({
          devMode: on,
          isAuthenticated: on,
          user: on ? DEV_USER : null,
        }),

      setPro: (isPro) => set({ isPro }),
    }),
    {
      name: "spb-auth",
    },
  ),
);
