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
  Star,
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
import { useHistoryStore, useBuilderStore } from "@/lib/store";

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
function HeroPromptPreview() {
  return (
    <div className="relative select-none">
      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

      <div className="relative rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border bg-bg-1">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[11px] text-text-3 font-mono ml-2">savage-prompt-builder</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Input */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-3 font-semibold mb-2">Your rough idea</p>
            <div className="rounded-[var(--radius-md)] bg-bg-3 border border-glass-border px-3.5 py-2.5">
              <p className="text-sm text-text-3 italic">"edgy streetwear hoodie drop, skull graphic, Y2K vibe"</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-glass-border" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/12 border border-accent/20">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-accent font-semibold">AI Polish</span>
            </div>
            <div className="flex-1 h-px bg-glass-border" />
          </div>

          {/* Output */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-3 font-semibold mb-2">Polished prompt</p>
            <div className="rounded-[var(--radius-md)] bg-bg-3 border border-accent/15 px-3.5 py-3 space-y-2">
              <p className="text-xs text-text-1 leading-relaxed">
                Oversized heavyweight streetwear hoodie, bold front-panel skull graphic rendered in glitch-art Y2K aesthetic,{" "}
                <span className="text-accent">distressed black cotton</span>, acid-washed details,{" "}
                <span className="text-violet-400">urban editorial product photography</span>,
                dramatic low-key lighting, dark background
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Streetwear", "Y2K", "Skull Graphic", "Editorial", "Dark"].map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-bg-2 border border-glass-border text-text-3 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Copy button */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-semibold cursor-default">
              <Star className="w-3 h-3" />
              Ready to generate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Background image */}
      <Image
        src={item.image}
        alt={item.label}
        fill
        className="object-cover"
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

  function handlePolish() {
    const value = polishInput.trim();
    if (!value) return;
    const store = useBuilderStore.getState();
    store.setTemplate("freestyle");
    store.setField("subject", value);
    router.push("/builder");
  }

  return (
    <div className="relative">
      {/* Hero glow backdrop */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-[500px] opacity-60 bg-hero-glow" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10 pb-24 md:pb-10 space-y-10">

        {/* ── HERO ── */}
        <section className="pt-2 md:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-center">

            <BlurFade delay={0}>
              <div>
                <div className="mb-4">
                  <AnimatedGradientText>
                    <Zap className="w-3.5 h-3.5 text-accent mr-1.5 inline-block" />
                    <span className="text-text-2 text-xs">
                      <span className="text-accent font-semibold">Prompt Polish</span>
                      {" "}— your AI creative co-pilot
                    </span>
                  </AnimatedGradientText>
                </div>

                <h1 className="font-display font-bold text-4xl md:text-5xl text-text-1 leading-[1.1] tracking-tight mb-4">
                  Turn rough ideas into{" "}
                  <span className="text-accent">precise AI prompts</span>
                </h1>

                <p className="text-text-2 text-base leading-relaxed max-w-lg mb-6">
                  Build, polish, and generate with Nanobanana 2. The professional prompt studio for designers, brands, and creators.
                </p>

                {/* Polish input */}
                <div className="relative rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border focus-within:border-accent/50 transition-all duration-200 overflow-hidden hover:shadow-[0_0_32px_rgba(255,107,0,0.08)]">
                  <textarea
                    value={polishInput}
                    onChange={(e) => setPolishInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePolish();
                    }}
                    placeholder="Paste any rough idea… Savage will refine it into a precise prompt"
                    rows={3}
                    aria-label="Quick prompt polish input"
                    className="w-full bg-transparent text-text-1 placeholder:text-text-3 text-base p-4 pr-36 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <kbd className="hidden sm:block text-[10px] text-text-3 border border-glass-border rounded-lg px-1.5 py-0.5 font-mono">⌘↵</kbd>
                    <button
                      onClick={handlePolish}
                      disabled={!polishInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
                        bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_16px_rgba(255,107,0,0.4)]
                        transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Polish It
                    </button>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs text-text-3 self-center">Jump to:</span>
                  {[
                    { label: "Builder", href: "/builder", icon: Wand2 },
                    { label: "Generate", href: "/generate", icon: Sparkles },
                    { label: "Library", href: "/library", icon: FileText },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                        bg-glass border border-glass-border text-text-2 hover:text-text-1 hover:bg-glass-hover
                        transition-colors cursor-pointer"
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.12} className="hidden lg:block">
              <HeroPromptPreview />
            </BlurFade>
          </div>
        </section>

        {/* ── PERSONAL STATS ── */}
        <BlurFade delay={0.08}>
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Prompts",       value: personalStats.total.toString(),      accent: "text-text-1"    },
                { label: "Favorites",     value: personalStats.favorites.toString(),  accent: "text-rose-400"  },
                { label: "Avg Rating",    value: personalStats.avgRating ?? "—",      accent: "text-amber-400" },
                { label: "Active Styles", value: personalStats.activeStyles.toString(), accent: "text-violet-400" },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border p-5 md:p-6 text-center hover:border-glass-border-strong transition-colors"
                >
                  <p className={cn("text-3xl font-display font-bold leading-none mb-1.5", accent)}>{value}</p>
                  <p className="label-section">{label}</p>
                </div>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* ── 14-DAY ACTIVITY ── */}
        <BlurFade delay={0.12}>
          <section>
            <ActivityChart prompts={savedPrompts} />
          </section>
        </BlurFade>

        {/* ── QUICK START ── */}
        <BlurFade delay={0.16}>
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="label-section mb-1">Quick Start</p>
                <h2 className="text-base font-semibold text-text-1">Pick a creative direction</h2>
              </div>
              <Link
                href="/builder"
                className="flex items-center gap-1.5 text-sm text-text-3 hover:text-accent transition-colors cursor-pointer"
              >
                All templates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {QUICK_START.map(({ templateId, label, icon: Icon, color }) => (
                <MagicCard
                  key={templateId}
                  onClick={() => {
                    useBuilderStore.getState().setTemplate(templateId);
                    router.push("/builder");
                  }}
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
        <BlurFade delay={0.2}>
          <section className="overflow-hidden relative pb-2">
            <p className="label-section mb-4">Made with Savage</p>
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-base to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-base to-transparent z-10" />
              <Marquee pauseOnHover className="[--duration:30s]">
                {SHOWCASE.map((item) => (
                  <ShowcaseTile key={item.label} item={item} />
                ))}
              </Marquee>
            </div>
          </section>
        </BlurFade>

        {/* Bottom padding for mobile tab bar */}
        <div className="h-6 md:h-2" />
      </div>
    </div>
  );
}
