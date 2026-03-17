"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, Github, Mail, Zap, Loader2, ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { BlurFade } from "@/components/ui/blur-fade";

/* ── Typing animation for the login hero headline ── */
const L1 = "Craft prompts";
const L2 = "that actually";
const L3 = "work.";
const TOTAL = L1.length + L2.length + L3.length;

function LoginHeroTyping() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (chars >= TOTAL) return;
    const timer = setTimeout(() => setChars((c) => c + 1), 55);
    return () => clearTimeout(timer);
  }, [chars]);

  const c1 = Math.min(chars, L1.length);
  const c2 = Math.min(Math.max(0, chars - L1.length), L2.length);
  const c3 = Math.min(Math.max(0, chars - L1.length - L2.length), L3.length);
  const cursorLine = chars <= L1.length ? 0 : chars <= L1.length + L2.length ? 1 : 2;

  return (
    <h1 className="font-display font-bold text-5xl text-text-1 leading-[1.1] tracking-tight">
      {L1.substring(0, c1)}
      {cursorLine === 0 && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-text-1 animate-pulse ml-0.5" />
      )}
      {c2 > 0 && <br />}
      {c2 > 0 && <span className="text-accent">{L2.substring(0, c2)}</span>}
      {cursorLine === 1 && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-accent animate-pulse ml-0.5" />
      )}
      {c3 > 0 && <br />}
      {c3 > 0 && L3.substring(0, c3)}
      {cursorLine === 2 && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-text-1 animate-pulse ml-0.5" />
      )}
    </h1>
  );
}

const PILLS = [
  { icon: Wand2, text: "Prompt Polish" },
  { icon: Sparkles, text: "AI Style Generator" },
  { icon: Zap, text: "Instant Mockups" },
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleOAuthLogin(provider: 'google' | 'github') {
    if (!supabase) {
      setError("Authentication is not configured. Please check your Supabase credentials.");
      return;
    }
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
    
    if (!supabase) {
      setError("Authentication is not configured. Please check your Supabase credentials.");
      return;
    }
    
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
      router.push("/home");
    } else {
      setError("Failed to start guest session");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative">
      {/* ── Left panel: cinematic branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        {/* Logo — group 1 */}
        <BlurFade delay={0.1} yOffset={10}>
          <div className="relative flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-accent/15 border border-accent/20">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display font-semibold text-[15px] text-text-1 tracking-tight">
              Savage
            </span>
          </div>
        </BlurFade>

        {/* Hero text */}
        <div className="relative space-y-6">
          {/* Badge — group 2 */}
          <BlurFade delay={0.8} yOffset={10}>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/15 text-accent-gold border border-accent-gold/20">
                AI Prompt Engine
              </span>
            </div>
          </BlurFade>

          {/* Headline — group 1 (typing animation) */}
          <BlurFade delay={0.15} yOffset={14}>
            <LoginHeroTyping />
          </BlurFade>

          {/* Subtitle — group 2 */}
          <BlurFade delay={1.0} yOffset={10}>
            <p className="text-text-2 text-lg leading-relaxed max-w-sm">
              Polish raw ideas into precise AI image prompts.
              Built for designers, tattoo artists, and creators.
            </p>
          </BlurFade>

          {/* Pills — groups 3, 4, 5 (staggered individually) */}
          <div className="flex flex-wrap gap-2 pt-2">
            {PILLS.map(({ icon: Icon, text }, i) => (
              <BlurFade key={text} delay={1.4 + i * 0.2} yOffset={8}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glass border border-glass-border text-text-2 text-xs">
                  <Icon className="w-3 h-3 text-accent" />
                  {text}
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <BlurFade delay={2.2} yOffset={6}>
          <p className="relative text-xs text-text-3">
            Secure authentication · No credit card required
          </p>
        </BlurFade>
      </div>

      {/* ── Right panel: dark card slides in from right ── */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 relative z-10"
      >
        <div className="w-full max-w-sm space-y-8 bg-bg-1/80 backdrop-blur-xl border border-glass-border rounded-[var(--radius-xl)] p-8 shadow-2xl">
          {/* Mobile logo (hidden on desktop) */}
          <BlurFade delay={0.8} yOffset={10}>
            <div className="flex flex-col items-center gap-3 lg:hidden">
              <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-accent/15 border border-accent/20">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <h1 className="font-display font-bold text-2xl text-text-1 tracking-tight">Savage</h1>
            </div>
          </BlurFade>

          {/* Heading */}
          <BlurFade delay={0.9} yOffset={10}>
            <div className="space-y-1">
              <h2 className="font-display font-semibold text-2xl text-text-1 tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-text-3">Sign in to your account to continue</p>
            </div>
          </BlurFade>

          {/* Alerts */}
          {error && (
            <div className="p-3 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 rounded-[var(--radius-md)] bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
              {message}
            </div>
          )}

          <BlurFade delay={1.0} yOffset={10}>
          <div className="space-y-3">
            {/* OAuth buttons */}
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-md)]
                bg-glass border border-glass-border text-text-1 text-sm font-medium
                hover:bg-glass-hover hover:border-glass-border-strong transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-md)]
                bg-glass border border-glass-border text-text-1 text-sm font-medium
                hover:bg-glass-hover hover:border-glass-border-strong transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Github className="w-4 h-4 shrink-0" />
              Continue with GitHub
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-glass-border" />
              <span className="text-xs text-text-3">or continue with email</span>
              <div className="flex-1 h-px bg-glass-border" />
            </div>

            {/* Magic link form */}
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="pl-10 rounded-[var(--radius-md)] bg-glass border-glass-border focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/50 text-sm h-11"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                  bg-accent text-white text-sm font-semibold
                  hover:opacity-90 transition-all duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send magic link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-glass-border" />
              <span className="text-xs text-text-3">or</span>
              <div className="flex-1 h-px bg-glass-border" />
            </div>

            {/* Guest / explore CTA — gold pill */}
            <button
              onClick={handleDevLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                bg-accent-gold text-accent-gold-contrast text-sm font-semibold
                hover:bg-accent-gold-hover transition-all duration-150 shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Explore as Guest
            </button>
          </div>
          </BlurFade>

          <BlurFade delay={1.2} yOffset={6}>
            <p className="text-center text-xs text-text-3">
              By continuing you agree to our{" "}
              <span className="text-text-2 underline-offset-2 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-text-2 underline-offset-2 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </BlurFade>
        </div>
      </motion.div>
    </div>
  );
}

