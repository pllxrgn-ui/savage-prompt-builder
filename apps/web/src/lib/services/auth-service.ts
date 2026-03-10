/**
 * Auth service — stub implementation using localStorage.
 * BACKEND: Replace with Supabase Auth / OAuth / custom JWT.
 */
import { useAuthStore } from "@/lib/store/auth-store";
import type { AuthUser } from "@/types";

// BACKEND: POST /api/auth/login
export async function login(
  email: string,
  _password: string,
): Promise<AuthUser> {
  // Stub: accept any credentials, return mock user
  await new Promise((r) => setTimeout(r, 500));

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: email.split("@")[0] ?? "User",
    email,
    avatarUrl: null,
  };

  useAuthStore.getState().login(user);
  return user;
}

// BACKEND: POST /api/auth/logout
export async function logout(): Promise<void> {
  useAuthStore.getState().logout();
}

// BACKEND: GET /api/auth/session
export function getSession(): AuthUser | null {
  return useAuthStore.getState().user;
}

// BACKEND: GET /api/auth/check-pro
export function checkProStatus(): boolean {
  return useAuthStore.getState().isPro;
}
