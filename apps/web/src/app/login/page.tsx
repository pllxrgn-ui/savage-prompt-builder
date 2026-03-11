"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Github, Mail, Zap, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleOAuthLogin(provider: 'google' | 'github') {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setIsLoading(false);
  }

  function handleDevLogin() {
    // We'll keep this as a fallback but suggest real login
    router.push("/builder");
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
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs text-center">
              {message}
            </div>
          )}

          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border bg-surface text-text-1 text-sm font-medium hover:bg-bg-1 transition-colors disabled:opacity-50"
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
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border bg-surface text-text-1 text-sm font-medium hover:bg-bg-1 transition-colors disabled:opacity-50"
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

          {/* Magic link */}
          <form onSubmit={handleMagicLink} className="flex gap-2">
            <div className="flex items-center gap-1.5 flex-1 rounded-lg border border-border bg-bg-1 px-3 py-2">
              <Mail className="w-3.5 h-3.5 text-text-3 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="px-3 py-2 rounded-lg bg-surface text-text-1 text-xs font-medium hover:bg-bg-1 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-text-3 uppercase tracking-wider">dev</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Dev mode skip */}
          <button
            onClick={handleDevLogin}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/15 transition-colors"
          >
            <Zap className="w-4 h-4 text-accent" />
            Explore as Guest
          </button>
        </div>

        <p className="text-center text-[10px] text-text-3">
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}

