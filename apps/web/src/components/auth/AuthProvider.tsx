"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type { User } from "@supabase/supabase-js";

const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const loginStore = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Fetch real profile from DB for 'pro' status
        const { data: profile } = await supabase
          .from('users')
          .select('tier')
          .eq('id', session.user.id)
          .single();

        // Sync with Zustand store
        loginStore({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
          email: session.user.email || "",
          avatarUrl: session.user.user_metadata.avatar_url || null,
        });

        // Set Pro status based on tier
        useAuthStore.getState().setPro(profile?.tier === 'pro');
      } else {
        setUser(null);
        logoutStore();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loginStore, logoutStore]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => useContext(AuthContext);
