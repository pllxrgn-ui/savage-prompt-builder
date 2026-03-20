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
  credits: number;
}

interface AuthActions {
  login: (user: AuthUser) => void;
  logout: () => void;
  setDevMode: (on: boolean) => void;
  setPro: (isPro: boolean) => void;
  setCredits: (credits: number) => void;
  deductCredits: (amount: number) => boolean;
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
    (set, get) => ({
      user: null,
      isPro: false,
      isAuthenticated: false,
      devMode: false,
      credits: 100,

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
          credits: 0,
        }),

      setDevMode: (on) =>
        set({
          devMode: on,
          isAuthenticated: on,
          user: on ? DEV_USER : null,
          credits: on ? 100 : 0,
        }),

      setPro: (isPro) => set({ isPro }),

      setCredits: (credits) => set({ credits: Math.max(0, credits) }),

      deductCredits: (amount) => {
        const { credits } = get();
        if (credits < amount) return false;
        set({ credits: credits - amount });
        return true;
      },
    }),
    {
      name: "spb-auth",
    },
  ),
);
