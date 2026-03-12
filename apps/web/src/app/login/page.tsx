"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Github, Mail, Zap, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GridPattern } from "@/components/ui/grid-pattern";
import { CircuitTraces } from "@/components/ui/circuit-traces";

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

  async function handleDevLogin() {
    setIsLoading(true);
    const res = await fetch('/api/auth/guest', { method: 'POST' });
    if (res.ok) {
      router.push("/builder");
    } else {
      setError("Failed to start guest session");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-1 px-4 overflow-hidden">
      {/* Blueprint grid */}
      <GridPattern className="opacity-[0.03] fixed" size={32} />
      <CircuitTraces />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo + Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 border border-accent/20">
            <Flame className="w-7 h-7 text-accent" />
            <div className="absolute inset-0 bg-accent/20 blur-lg -z-10" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-mono font-bold text-text-1 uppercase tracking-wider">Savage Prompt Builder</h1>
            <p className="text-[10px] font-mono text-text-3 mt-1">Build precise, beautiful AI image prompts</p>
          </div>
        </div>

        {/* Auth Card with animated border */}
        <div className="relative p-px overflow-hidden">
          {/* Animated border gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg, var(--accent), transparent 30%, transparent 70%, var(--accent))",
              animation: "spin 4s linear infinite",
              opacity: 0.4,
            }}
          />
          <div className="absolute inset-px bg-bg-2" />

          <div className="relative p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-mono text-center">
                {message}
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-accent/8" />
            </div>

            {/* Magic link */}
            <form onSubmit={handleMagicLink} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="pl-9 font-mono"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isLoading || !email}
                className="font-mono uppercase tracking-wider text-[10px]"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-accent/8" />
              <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider">explore</span>
              <div className="flex-1 h-px bg-accent/8" />
            </div>

            {/* Guest mode — accent button */}
            <Button
              onClick={handleDevLogin}
              className={cn(
                "w-full py-3 gap-2",
                "bg-accent text-black font-mono font-bold uppercase tracking-wider",
                "hover:shadow-[0_0_24px_rgba(var(--accent-rgb,255,107,0),0.3)]",
                "active:scale-[0.98] transition-all duration-200",
              )}
            >
              <Zap className="w-4 h-4" />
              Explore as Guest
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] font-mono text-text-3">
          Secure authentication powered by Supabase
        </p>
      </div>

      {/* CSS for spinning border */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

