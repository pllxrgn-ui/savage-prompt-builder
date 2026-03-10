"use client";

import { useRouter } from "next/navigation";
import { Flame, Github, Mail, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { setDevMode } = useAuth();

  function handleDevLogin() {
    setDevMode(true);
    router.push("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-1 px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo + Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15">
            <Flame className="w-7 h-7 text-accent" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-text-1">Savage Prompt Builder</h1>
            <p className="text-sm text-text-3 mt-1">Build precise, beautiful AI image prompts</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-border bg-bg-2 p-6 space-y-4">
          {/* OAuth buttons — disabled */}
          <button
            disabled
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border bg-surface text-text-3 text-sm font-medium cursor-not-allowed opacity-60"
            title="Coming soon"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <button
            disabled
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border bg-surface text-text-3 text-sm font-medium cursor-not-allowed opacity-60"
            title="Coming soon"
          >
            <Github className="w-4 h-4" />
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-text-3 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Magic link — disabled */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 flex-1 rounded-lg border border-border bg-bg-1 px-3 py-2 opacity-60">
              <Mail className="w-3.5 h-3.5 text-text-3 shrink-0" />
              <input
                type="email"
                disabled
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-text-3 placeholder:text-text-3 outline-none cursor-not-allowed"
              />
            </div>
            <button
              disabled
              className="px-3 py-2 rounded-lg bg-surface text-text-3 text-xs font-medium cursor-not-allowed opacity-60"
              title="Coming soon"
            >
              Send
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-text-3 uppercase tracking-wider">dev</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Dev mode skip */}
          <button
            onClick={handleDevLogin}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Skip Login (Dev Mode)
          </button>
        </div>

        <p className="text-center text-[10px] text-text-3">
          BACKEND: Wire OAuth buttons to Supabase Auth
        </p>
      </div>
    </div>
  );
}
