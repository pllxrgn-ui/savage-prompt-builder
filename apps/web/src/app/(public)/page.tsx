"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

const LINE_1 = "Craft prompts that";
const LINE_2 = "actually work";
const CHAR_MS = 65;
const PAUSE_MS = 300;

function HeroTyping() {
  const [chars, setChars] = useState(0);
  const total = LINE_1.length + LINE_2.length;

  useEffect(() => {
    if (chars >= total) return;

    const isInPause = chars === LINE_1.length;
    const delay = isInPause ? PAUSE_MS : CHAR_MS;

    const timer = setTimeout(() => setChars((c) => c + 1), delay);
    return () => clearTimeout(timer);
  }, [chars, total]);

  const line1Text = LINE_1.substring(0, Math.min(chars, LINE_1.length));
  const line2Chars = Math.max(0, chars - LINE_1.length);
  const line2Text = LINE_2.substring(0, line2Chars);
  const done = chars >= total;

  return (
    <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-text-1 leading-[1.05] tracking-tight mb-6">
      {line1Text}
      {chars < LINE_1.length && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-text-1 animate-pulse ml-0.5" />
      )}
      {chars >= LINE_1.length && <br />}
      {line2Text && (
        <span className="text-accent">{line2Text}</span>
      )}
      {chars >= LINE_1.length && !done && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-accent animate-pulse ml-0.5" />
      )}
      {done && (
        <span className="inline-block w-[3px] h-[0.85em] align-middle bg-accent animate-pulse ml-0.5" />
      )}
    </h1>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const navigateTo = useCallback(
    (href: string) => {
      setExiting(true);
      setTimeout(() => router.push(href), 500);
    },
    [router],
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Content — fades/scales out on exit */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl transition-all duration-500"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scale(0.97) translateY(-12px)" : "scale(1) translateY(0)",
          filter: exiting ? "blur(6px)" : "blur(0)",
        }}
      >
        {/* Brand badge — visually on top, reveals with group 2 */}
        <BlurFade delay={1.2} yOffset={12}>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent/15 border border-accent/20">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display font-semibold text-lg text-text-1 tracking-tight">
              Sidekick Prompt Builder
            </span>
          </div>
        </BlurFade>

        {/* GROUP 1 — Hero headline (shows first, typing starts immediately) */}
        <BlurFade delay={0.05} yOffset={16}>
          <HeroTyping />
        </BlurFade>

        {/* GROUP 2 — Subtitle (shows second, same wave as badge) */}
        <BlurFade delay={1.5} yOffset={10}>
          <p className="text-text-2 text-lg sm:text-xl leading-relaxed max-w-lg mb-4">
            The AI prompt engineering tool for designers, tattoo artists,
            and creators. Build precise prompts for any generative model.
          </p>
        </BlurFade>

        {/* GROUP 3 — Feature pills + CTA buttons (shows last) */}
        <BlurFade delay={2.0} yOffset={8}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { icon: Sparkles, text: "20+ Templates" },
              { icon: Flame, text: "AI Polish & Refine" },
              { icon: ArrowRight, text: "One-Click Generate" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glass border border-glass-border text-text-3 text-xs font-medium"
              >
                <Icon className="w-3 h-3 text-accent" />
                {text}
              </span>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={2.2} yOffset={10}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo("/login?mode=signup")}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 cursor-pointer shadow-lg shadow-accent/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo("/login")}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-glass border border-glass-border text-text-1 text-sm font-semibold hover:bg-glass-hover hover:border-glass-border-strong transition-colors duration-150 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </BlurFade>

        {/* Bottom note */}
        <BlurFade delay={2.5} yOffset={6}>
          <p className="mt-12 text-xs text-text-3">
            No credit card required · Free guest mode available
          </p>
        </BlurFade>
      </div>
    </div>
  );
}
