"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Zap,
  FileText,
  ImagePlay,
  Video,
  Shirt,
  Palette,
  Pen,
  Package,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useHistoryStore, useBuilderStore } from "@/lib/store";
import { useAuthGate } from "@/hooks/useAuthGate";

/* ── Showcase tiles for the Marquee ── */
const SHOWCASE = [
  {
    label: "Tattoo Flash",
    sub: "Traditional American",
    color: "from-rose-500/30 via-orange-500/15 to-bg-2",
    glow: "bg-rose-500/10",
    icon: Pen,
    accent: "text-rose-400",
    image: "/showcase/tiles/tattoo-flash.jpg",
  },
  {
    label: "Streetwear",
    sub: "Apparel drop concept",
    color: "from-violet-500/30 via-indigo-500/15 to-bg-2",
    glow: "bg-violet-500/10",
    icon: Shirt,
    accent: "text-violet-400",
    image: "/showcase/tiles/streetwear.jpg",
  },
  {
    label: "Brand Identity",
    sub: "Logo & mark system",
    color: "from-amber-500/30 via-yellow-400/15 to-bg-2",
    glow: "bg-amber-500/10",
    icon: Palette,
    accent: "text-amber-400",
    image: "/showcase/tiles/brand-identity.jpg",
  },
  {
    label: "Sticker Pack",
    sub: "Die-cut vinyl set",
    color: "from-emerald-500/30 via-teal-500/15 to-bg-2",
    glow: "bg-emerald-500/10",
    icon: Sparkles,
    accent: "text-emerald-400",
    image: "/showcase/tiles/sticker-pack.jpg",
  },
  {
    label: "Art Print",
    sub: "Risograph poster",
    color: "from-sky-500/30 via-blue-500/15 to-bg-2",
    glow: "bg-sky-500/10",
    icon: ImagePlay,
    accent: "text-sky-400",
    image: "/showcase/tiles/art-print.jpg",
  },
  {
    label: "Product Mockup",
    sub: "3D render concept",
    color: "from-pink-500/30 via-rose-400/15 to-bg-2",
    glow: "bg-pink-500/10",
    icon: Package,
    accent: "text-pink-400",
    image: "/showcase/tiles/product-mockup.jpg",
  },
  {
    label: "Video Concept",
    sub: "Motion storyboard",
    color: "from-cyan-500/30 via-sky-500/15 to-bg-2",
    glow: "bg-cyan-500/10",
    icon: Video,
    accent: "text-cyan-400",
    image: "/showcase/tiles/video-concept.jpg",
  },
  {
    label: "Pattern Design",
    sub: "Seamless textile",
    color: "from-fuchsia-500/30 via-purple-500/15 to-bg-2",
    glow: "bg-fuchsia-500/10",
    icon: Palette,
    accent: "text-fuchsia-400",
    image: "/showcase/tiles/pattern-design.jpg",
  },
] as const;

/* ── Category quick-start cards ── */
const QUICK_START = [
  { templateId: "clothing",  label: "Clothing & Fashion", icon: Shirt,    color: "text-violet-400 bg-violet-500/10" },
  { templateId: "tattoo",    label: "Tattoo Design",      icon: Pen,      color: "text-rose-400 bg-rose-500/10" },
  { templateId: "brand",     label: "Brand Identity",     icon: Palette,  color: "text-amber-400 bg-amber-500/10" },
  { templateId: "mockup",    label: "Product Mockup",     icon: Package,  color: "text-emerald-400 bg-emerald-500/10" },
] as const;

/* ── Day labels for activity chart ── */
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

/* ── Decorative hero preview card ── */
/* ── 14-day activity bar chart ── */
function ActivityChart({ prompts }: { prompts: { createdAt: string }[] }) {
  const days = getLastNDays(14);
  const today = new Date().toISOString().slice(0, 10);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of days) map[d] = 0;
    for (const p of prompts) {
      const day = p.createdAt.slice(0, 10);
      if (day in map) map[day] = (map[day] ?? 0) + 1;
    }
    return days.map((d) => ({ date: d, count: map[d] ?? 0 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompts.length]);

  const maxCount = Math.max(1, ...counts.map((c) => c.count));
  const todayCount = counts.find((c) => c.date === today)?.count ?? 0;

  return (
    <div className="rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-accent" />
          <p className="label-section">14-Day Activity</p>
        </div>
        <p className="text-xs text-text-3">
          {todayCount === 0 ? "0 prompts today" : `${todayCount} prompt${todayCount !== 1 ? "s" : ""} today`}
        </p>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-14">
        {counts.map(({ date, count }) => {
          const isToday = date === today;
          const heightPct = count === 0 ? 0 : Math.max(8, Math.round((count / maxCount) * 100));
          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center"
              title={`${date}: ${count} prompt${count !== 1 ? "s" : ""}`}
            >
              <div className="flex-1 flex items-end w-full">
                <div
                  className={cn(
                    "w-full rounded-sm transition-all duration-300",
                    count === 0
                      ? "bg-bg-3"
                      : isToday
                        ? "bg-accent shadow-[0_0_6px_rgba(255,107,0,0.5)]"
                        : "bg-text-3/40 hover:bg-text-3/70",
                  )}
                  // eslint-disable-next-line react/forbid-component-props
                  style={{ height: count === 0 ? "2px" : `${heightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5 mt-2">
        {counts.map(({ date }) => {
          const isToday = date === today;
          const dayLabel = DAY_LABELS[new Date(date + "T12:00:00").getDay()];
          return (
            <div key={date} className="flex-1 flex justify-center">
              <span className={cn("text-[9px] font-medium", isToday ? "text-accent font-bold" : "text-text-3")}>
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShowcaseTile({ item }: { item: (typeof SHOWCASE)[number] }) {
  return (
    <div
      className={cn(
        "relative shrink-0 w-40 h-52 rounded-[var(--radius-xl)] overflow-hidden",
        "border border-glass-border",
        "hover:border-glass-border-strong transition-all duration-200 cursor-pointer group",
      )}
    >
      {/* Background image with Ken Burns */}
      <Image
        src={item.image}
        alt={item.label}
        fill
        className="object-cover transition-transform duration-[4s] ease-out group-hover:scale-110"
        sizes="160px"
      />

      {/* Gradient color overlay to preserve card tint */}
      <div className={cn("absolute inset-0 bg-gradient-to-b opacity-60", item.color)} />

      {/* Darkening overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-bg-base/95 via-bg-base/60 to-transparent">
        <p className="text-xs font-semibold text-text-1 group-hover:text-white transition-colors leading-tight">{item.label}</p>
        <p className="text-[10px] text-text-3 mt-0.5 leading-tight">{item.sub}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [polishInput, setPolishInput] = useState("");
  const router = useRouter();
  const { isAuthenticated, requireAuth, AuthGateModal } = useAuthGate();

  const savedPrompts = useHistoryStore((s) => s.savedPrompts);
  const selectedStyles = useBuilderStore((s) => s.selectedStyles);

  const personalStats = useMemo(() => {
    const total = savedPrompts.length;
    const favorites = savedPrompts.filter((p) => p.starred).length;
    const rated = savedPrompts.filter((p) => p.score != null);
    const avgRating =
      rated.length > 0
        ? (rated.reduce((sum, p) => sum + (p.score ?? 0), 0) / rated.length).toFixed(1)
        : null;
    return { total, favorites, avgRating, activeStyles: selectedStyles.length };
  }, [savedPrompts, selectedStyles]);

  const handlePolish = requireAuth(() => {
    const value = polishInput.trim();
    if (!value) return;
    const store = useBuilderStore.getState();
    store.setTemplate("freestyle");
    store.setField("subject", value);
    router.push("/builder");
  });

  const handleQuickStart = requireAuth((templateId: string) => {
    useBuilderStore.getState().setTemplate(templateId);
    router.push("/builder");
  });

  const handleNavigate = requireAuth((href: string) => {
    router.push(href);
  });

  return (
    <div className="relative">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10 pb-24 md:pb-10 space-y-10">

        {/* ── HERO — Full-bleed cinematic video hero ── */}
        <section className="relative -mx-6 md:-mx-10 -mt-10 overflow-hidden rounded-b-[var(--radius-xl)]">
          {/* Subtle glow backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[480px] md:min-h-[540px] px-6 py-16 md:py-20">

            {/* Badge */}
            <BlurFade delay={0}>
              <AnimatedGradientText className="mb-6">
                <Zap className="w-3.5 h-3.5 text-accent mr-1.5 inline-block" />
                <span className="text-text-2 text-xs">
                  <span className="text-accent font-semibold">AI-Powered</span>
                  {" "}Prompt Engine
                </span>
              </AnimatedGradientText>
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={0.08}>
              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-text-1 leading-[1.05] tracking-tight mb-5 max-w-3xl">
                Every creative vision{" "}
                <br className="hidden md:block" />
                needs a{" "}
                <span className="text-accent">sidekick</span>
              </h1>
            </BlurFade>

            {/* Subheadline */}
            <BlurFade delay={0.14}>
              <p className="text-text-2 text-base md:text-lg leading-relaxed max-w-xl mb-8">
                Transform rough ideas into production-ready AI prompts for image and video generation.
                Built for designers, brands, and creators who demand precision.
              </p>
            </BlurFade>

            {/* Polish input bar — centered, glass morphism */}
            <BlurFade delay={0.2} className="w-full max-w-2xl">
              <div className="relative rounded-[var(--radius-xl)] bg-bg-2/80 backdrop-blur-xl border border-glass-border focus-within:border-accent/50 transition-all duration-200 overflow-hidden hover:shadow-[0_0_40px_rgba(255,107,0,0.1)]">
                <textarea
                  value={polishInput}
                  onChange={(e) => setPolishInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePolish();
                  }}
                  placeholder="Describe anything — SIDEKICK will transform it into a precise prompt…"
                  rows={2}
                  aria-label="Quick prompt polish input"
                  className="w-full bg-transparent text-text-1 placeholder:text-text-3 text-base p-4 pr-36 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <kbd className="hidden sm:block text-[10px] text-text-3 border border-glass-border rounded-lg px-1.5 py-0.5 font-mono">⌘↵</kbd>
                  <button
                    onClick={handlePolish}
                    disabled={!polishInput.trim()}
                    className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold
                      bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_16px_rgba(255,107,0,0.4)]
                      transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Polish It
                  </button>
                  <ShimmerButton
                    onClick={handlePolish}
                    disabled={!polishInput.trim()}
                    className="sm:hidden h-9 px-4 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Polish It
                  </ShimmerButton>
                </div>
              </div>
            </BlurFade>

            {/* Quick action links */}
            <BlurFade delay={0.26}>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                <span className="text-xs text-text-3 self-center">Jump to:</span>
                {[
                  { label: "Builder", href: "/builder", icon: Wand2 },
                  { label: "Generate", href: "/generate", icon: Sparkles },
                  { label: "Library", href: "/library", icon: FileText },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={isAuthenticated ? href : "#"}
                    onClick={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        handleNavigate(href);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                      bg-glass/80 backdrop-blur-sm border border-glass-border text-text-2 hover:text-text-1 hover:bg-glass-hover
                      transition-colors cursor-pointer"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </Link>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── QUICK START ── */}
        <BlurFade delay={0.08}>
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="label-section mb-1">Quick Start</p>
                <h2 className="text-base font-semibold text-text-1">Pick a creative direction</h2>
              </div>
              <Link
                href={isAuthenticated ? "/builder" : "#"}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    handleNavigate("/builder");
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-text-3 hover:text-accent transition-colors cursor-pointer"
              >
                All templates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {QUICK_START.map(({ templateId, label, icon: Icon, color }) => (
                <MagicCard
                  key={templateId}
                  onClick={() => handleQuickStart(templateId)}
                  className="rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border p-5 cursor-pointer hover:border-glass-border-strong transition-colors group"
                >
                  <div className={cn("w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center mb-3", color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-text-1">{label}</p>
                  <p className="text-xs text-text-3 mt-1 flex items-center gap-1">
                    Start building <ArrowRight className="w-3 h-3" />
                  </p>
                </MagicCard>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* ── SHOWCASE MARQUEE ── */}
        <BlurFade delay={0.12}>
          <section className="overflow-hidden relative pb-2">
            <p className="label-section mb-4">Made with SIDEKICK Studios</p>
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-base to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-base to-transparent z-10" />
              <Marquee pauseOnHover className="[--duration:30s] [--gap:0.5rem]">
                {SHOWCASE.map((item) => (
                  <ShowcaseTile key={item.label} item={item} />
                ))}
              </Marquee>
            </div>
          </section>
        </BlurFade>

        {/* ── PERSONAL STATS ── */}
        <BlurFade delay={0.16}>
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Prompts",       value: personalStats.total,               accent: "text-text-1",     decimals: 0 },
                { label: "Favorites",     value: personalStats.favorites,            accent: "text-rose-400",   decimals: 0 },
                { label: "Avg Rating",    value: personalStats.avgRating != null ? parseFloat(personalStats.avgRating) : null, accent: "text-amber-400", decimals: 1 },
                { label: "Active Styles", value: personalStats.activeStyles,         accent: "text-violet-400", decimals: 0 },
              ].map(({ label, value, accent, decimals }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border p-5 md:p-6 text-center hover:border-glass-border-strong transition-colors"
                >
                  <p className={cn("text-3xl font-display font-bold leading-none mb-1.5", accent)}>
                    {value != null && typeof value === "number" && value > 0 ? (
                      <NumberTicker value={value} decimalPlaces={decimals} className={cn("text-3xl font-display font-bold", accent)} />
                    ) : (
                      value != null ? String(value) : "—"
                    )}
                  </p>
                  <p className="label-section">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* ── 14-DAY ACTIVITY ── */}
        <BlurFade delay={0.2}>
          <section>
            <ActivityChart prompts={savedPrompts} />
          </section>
        </BlurFade>

        {/* Bottom padding for mobile tab bar */}
        <div className="h-6 md:h-2" />
      </div>

      <AuthGateModal />
    </div>
  );
}
