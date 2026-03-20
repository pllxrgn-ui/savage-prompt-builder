import { useAuthStore } from "@/lib/store/auth-store";
import type { AuthUser } from "@/lib/store/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isPro = useAuthStore((s) => s.isPro);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const devMode = useAuthStore((s) => s.devMode);
  const setDevMode = useAuthStore((s) => s.setDevMode);
  const setPro = useAuthStore((s) => s.setPro);
  const credits = useAuthStore((s) => s.credits);
  const setCredits = useAuthStore((s) => s.setCredits);
  const deductCredits = useAuthStore((s) => s.deductCredits);

  return { user, isPro, isAuthenticated, login, logout, devMode, setDevMode, setPro, credits, setCredits, deductCredits };
}

export type { AuthUser };
