"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Zap,
  Sparkles,
  Image as ImageIcon,
  History,
  Layers,
  Palette,
  Users,
  ChevronDown,
} from "lucide-react";

// ─── Pricing data ──────────────────────────────────────────────────
const MONTHLY_PRO = 12;
const YEARLY_PRO = 99; // ~$8.25/mo
const YEARLY_SAVINGS_PCT = Math.round((1 - YEARLY_PRO / (MONTHLY_PRO * 12)) * 100);

interface Feature {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  icon: React.ElementType;
}

const FEATURES: Feature[] = [
  { label: "Templates",          free: "21 templates",    pro: "21 templates",                icon: Layers     },
  { label: "Prompt Builder",     free: true,              pro: true,                          icon: Sparkles   },
  { label: "Copy Prompts",       free: true,              pro: true,                          icon: Check      },
  { label: "Prompt History",     free: "Last 10",         pro: "Unlimited + cloud sync",      icon: History    },
  { label: "AI Style Polish",    free: false,             pro: true,                          icon: Zap        },
  { label: "Image Generation",   free: false,             pro: "50 / day",                    icon: ImageIcon  },
  { label: "Bulk Generation",    free: false,             pro: true,                          icon: Layers     },
  { label: "Style Packs",        free: "2 included",      pro: "All 20+",                     icon: Palette    },
  { label: "Priority Support",   free: false,             pro: true,                          icon: Users      },
];

const FAQS = [
  {
    q: "Can I use the builder without an account?",
    a: "Yes — guests get full access to the prompt builder with local history. Create an account to unlock cloud sync and Pro features.",
  },
  {
    q: "What counts as an image generation?",
    a: "Each time the Generate page creates an image counts as one generation. Bulk generation counts per image produced.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Absolutely. Cancel anytime from your settings; you keep Pro access until the end of your billing period.",
  },
];

// ─── Helper components ─────────────────────────────────────────────

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === false) return <X className="w-4 h-4 text-text-3 mx-auto" />;
  if (value === true)  return <Check className="w-4 h-4 text-accent mx-auto" />;
  return <span className="text-xs text-text-1 text-center block">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-glass-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open ? "true" : "false"}
        className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
      >
        <span className="text-sm font-medium text-text-1">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-3 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <p className="pb-4 text-sm text-text-2 leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const proPrice = yearly ? (YEARLY_PRO / 12).toFixed(2) : MONTHLY_PRO;

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-20 pb-24 sm:py-28 sm:pb-28">
      {/* Header */}
      <div className="text-center mb-12 max-w-xl">
        <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 rounded-full text-xs font-medium">
          Simple Pricing
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-1 leading-tight mb-4">
          Build prompts for free.<br />
          <span className="text-accent">Generate with Pro.</span>
        </h1>
        <p className="text-text-2 text-base leading-relaxed">
          Start without an account. Upgrade when you need AI polish, image generation, and unlimited history.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-10">
        <span className={cn("text-sm transition-colors", !yearly ? "text-text-1 font-medium" : "text-text-3")}>
          Monthly
        </span>
        <button
          role="switch"
          aria-checked={yearly ? "true" : "false"}
          aria-label="Toggle yearly billing"
          onClick={() => setYearly((v) => !v)}
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            yearly ? "bg-accent" : "bg-bg-3 border border-glass-border",
          )}
        >
          <span className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
            yearly && "translate-x-5",
          )} />
        </button>
        <span className={cn("text-sm transition-colors flex items-center gap-1.5", yearly ? "text-text-1 font-medium" : "text-text-3")}>
          Yearly
          <span className="text-[11px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
            Save {YEARLY_SAVINGS_PCT}%
          </span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="w-full max-w-4xl grid sm:grid-cols-2 gap-5 mb-16">
        {/* Free */}
        <div className="bg-bg-2 border border-glass-border rounded-[var(--radius-xl)] p-8 flex flex-col gap-6">
          <div>
            <p className="label-section mb-2">Free</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-text-1">$0</span>
              <span className="text-text-3 text-sm">/ month</span>
            </div>
            <p className="text-text-3 text-sm mt-1">No credit card required.</p>
          </div>
          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full border-glass-border text-text-1 hover:bg-glass-hover rounded-full transition-colors duration-150 cursor-pointer"
            >
              Get Started Free
            </Button>
          </Link>
          <ul className="space-y-3">
            {FEATURES.filter((f) => f.free !== false).map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.label} className="flex items-start gap-2.5 text-sm">
                  <Icon className="w-4 h-4 text-text-3 mt-0.5 shrink-0" />
                  <span className="text-text-2">
                    <span className="text-text-1 font-medium">{f.label}</span>
                    {typeof f.free === "string" && ` — ${f.free}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pro */}
        <div className={cn(
          "relative bg-bg-2 border rounded-[var(--radius-xl)] p-8 flex flex-col gap-6",
          "border-accent/30 shadow-[0_0_40px_rgba(255,107,0,0.08)]",
        )}>
          {/* Most Popular badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-accent text-white text-[11px] font-bold rounded-full px-3 py-1 shadow-md">
              MOST POPULAR
            </span>
          </div>

          <div>
            <p className="label-section mb-2">Pro</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-text-1">${proPrice}</span>
              <span className="text-text-3 text-sm">/ month</span>
            </div>
            <p className="text-text-3 text-sm mt-1">
              {yearly ? `Billed $${YEARLY_PRO}/year` : "Billed monthly. Cancel anytime."}
            </p>
          </div>

          <Link href="/login?plan=pro" className="block">
            <Button className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors duration-150 cursor-pointer shadow-[0_0_20px_rgba(255,107,0,0.25)]">
              Upgrade to Pro
            </Button>
          </Link>

          <ul className="space-y-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const isBetter = typeof f.pro === "string" && typeof f.free === "string" && f.pro !== f.free;
              return (
                <li key={f.label} className="flex items-start gap-2.5 text-sm">
                  <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-text-2">
                    <span className="text-text-1 font-medium">{f.label}</span>
                    {typeof f.pro === "string" && ` — `}
                    {typeof f.pro === "string" && (
                      <span className={cn(isBetter && "text-accent font-medium")}>{f.pro}</span>
                    )}
                    {f.pro === true && f.free === false && (
                      <span className="text-accent font-medium"> — included</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Full feature comparison table */}
      <div className="w-full max-w-3xl mb-16">
        <h2 className="font-heading text-lg font-semibold text-text-1 mb-4">Full comparison</h2>
        <div className="bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-5 py-3 text-text-3 font-medium text-xs uppercase tracking-wide">Feature</th>
                <th className="px-5 py-3 text-center text-text-2 font-medium">Free</th>
                <th className="px-5 py-3 text-center text-accent font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr
                  key={f.label}
                  className={cn(
                    "border-b border-glass-border last:border-0 transition-colors duration-100",
                    i % 2 === 0 ? "bg-transparent" : "bg-bg-3/30",
                  )}
                >
                  <td className="px-5 py-3 text-text-1 font-medium">{f.label}</td>
                  <td className="px-5 py-3"><FeatureCell value={f.free} /></td>
                  <td className="px-5 py-3"><FeatureCell value={f.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="w-full max-w-2xl mb-16">
        <h2 className="font-heading text-lg font-semibold text-text-1 mb-2">FAQ</h2>
        <div className="bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] px-6">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-text-3 text-sm">
          Questions?{" "}
          <a href="mailto:hello@savageprompt.com" className="text-accent hover:underline">
            hello@savageprompt.com
          </a>
        </p>
      </div>
    </div>
  );
}
