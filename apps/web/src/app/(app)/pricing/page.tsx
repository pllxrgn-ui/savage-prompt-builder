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
  Crown,
  ChevronDown,
} from "lucide-react";

// ─── Pricing data ──────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  credits: number;
  resolution: string;
  creditCost: string;
  maxGens: string;
  badge?: string;
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    credits: 100,
    resolution: "1K only",
    creditCost: "10 credits / image",
    maxGens: "~10 / month",
    cta: "Get Started Free",
    ctaLink: "/login",
    features: [
      "21 templates",
      "Prompt builder",
      "Copy prompts",
      "Last 10 prompt history",
      "2 style packs",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 22,
    yearly: 158,
    credits: 500,
    resolution: "HD 1K–2K",
    creditCost: "35 credits / HD image",
    maxGens: "~14 HD / month",
    cta: "Start with Starter",
    ctaLink: "/login?plan=starter",
    features: [
      "Everything in Free",
      "HD 1K–2K resolution",
      "AI style polish",
      "Unlimited history + cloud sync",
      "10 style packs",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 45,
    yearly: 324,
    credits: 1200,
    resolution: "HD 35cr / 4K 65cr",
    creditCost: "35–65 credits / image",
    maxGens: "~22 / month",
    badge: "MOST POPULAR",
    highlighted: true,
    cta: "Upgrade to Pro",
    ctaLink: "/login?plan=pro",
    features: [
      "Everything in Starter",
      "4K resolution unlocked",
      "All 20+ style packs",
      "Bulk generation",
      "Priority support",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    monthly: 85,
    yearly: 612,
    credits: 3000,
    resolution: "1K–2K + 4K batch",
    creditCost: "10–65 credits / image",
    maxGens: "~300 / month",
    cta: "Go Studio",
    ctaLink: "/login?plan=studio",
    features: [
      "Everything in Pro",
      "4K batch generation",
      "Custom style packs",
      "Dedicated support",
      "Early access to new features",
    ],
  },
];

// Annual savings percentage (use Starter as representative — ~40%)
const YEARLY_SAVINGS_PCT = Math.round(
  (1 - PLANS[1].yearly / (PLANS[1].monthly * 12)) * 100,
);

interface ComparisonFeature {
  label: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
  studio: string | boolean;
  icon: React.ElementType;
}

const COMPARISON: ComparisonFeature[] = [
  { label: "Monthly Credits",    free: "100",              starter: "500",           pro: "1,200",                studio: "3,000",              icon: Zap       },
  { label: "Resolution",         free: "1K standard",      starter: "HD 1K–2K",      pro: "HD + 4K",              studio: "1K–2K + 4K batch",   icon: ImageIcon },
  { label: "Templates",          free: "21",               starter: "21",            pro: "21",                   studio: "21",                 icon: Layers    },
  { label: "Prompt Builder",     free: true,               starter: true,            pro: true,                   studio: true,                 icon: Sparkles  },
  { label: "AI Style Polish",    free: false,              starter: true,            pro: true,                   studio: true,                 icon: Zap       },
  { label: "Prompt History",     free: "Last 10",          starter: "Unlimited",     pro: "Unlimited",            studio: "Unlimited",          icon: History   },
  { label: "Cloud Sync",         free: false,              starter: true,            pro: true,                   studio: true,                 icon: Layers    },
  { label: "Style Packs",        free: "2 included",       starter: "10",            pro: "All 20+",              studio: "All + custom",       icon: Palette   },
  { label: "Bulk Generation",    free: false,              starter: false,           pro: true,                   studio: "4K batch",           icon: Layers    },
  { label: "Priority Support",   free: false,              starter: false,           pro: true,                   studio: "Dedicated",          icon: Users     },
  { label: "Early Access",       free: false,              starter: false,           pro: false,                  studio: true,                 icon: Crown     },
];

const FAQS = [
  {
    q: "How do credits work?",
    a: "Credits are your generation currency. Each image costs credits based on resolution: 1K standard costs 10 credits, HD 1K–2K costs 35 credits, and 4K costs 65 credits. Your credits refresh every billing cycle — unused credits do not roll over.",
  },
  {
    q: "Can I use the builder without an account?",
    a: "Yes — guests get full access to the prompt builder with local history. Create an account to unlock cloud sync, AI features, and image generation.",
  },
  {
    q: "What resolution should I choose?",
    a: "1K is great for quick previews and social media. HD 1K–2K is ideal for most professional work. 4K is for print-quality output and large-format designs.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. Cancel anytime from your settings; you keep access until the end of your billing period. No hidden fees.",
  },
  {
    q: "What happens to unused credits?",
    a: "Unused credits expire at the end of each billing period and do not roll over. This is standard across credit-based platforms.",
  },
];

// ─── Helper components ─────────────────────────────────────────────

function ComparisonCell({ value }: { value: string | boolean }) {
  if (value === false) return <X className="w-4 h-4 text-text-3 mx-auto" />;
  if (value === true) return <Check className="w-4 h-4 text-accent mx-auto" />;
  return <span className="text-xs text-text-1 text-center block">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-glass-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
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

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly && plan.monthly > 0
    ? (plan.yearly / 12).toFixed(0)
    : plan.monthly;
  const annualSavings = plan.monthly > 0
    ? Math.round(plan.monthly * 12 - plan.yearly)
    : 0;

  return (
    <div
      className={cn(
        "relative bg-bg-2 border rounded-[var(--radius-xl)] p-6 flex flex-col gap-5",
        plan.highlighted
          ? "border-accent/30 shadow-[0_0_40px_rgba(255,107,0,0.08)]"
          : "border-glass-border",
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-white text-[11px] font-bold rounded-full px-3 py-1 shadow-md whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <p className="label-section mb-2">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-text-1">
            ${price}
          </span>
          <span className="text-text-3 text-sm">/ mo</span>
        </div>
        {plan.monthly === 0 ? (
          <p className="text-text-3 text-xs mt-1">Always free. No card required.</p>
        ) : yearly ? (
          <p className="text-text-3 text-xs mt-1">
            ${plan.yearly}/yr billed annually{" "}
            <span className="text-accent font-medium">(save ${annualSavings})</span>
          </p>
        ) : (
          <p className="text-text-3 text-xs mt-1">
            Billed monthly.{" "}
            <span className="text-accent/70">Switch to annual &amp; save.</span>
          </p>
        )}
      </div>

      {/* Credits + resolution highlight */}
      <div className="bg-bg-3/50 rounded-[var(--radius-md)] px-4 py-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-text-3">Credits</span>
          <span className="text-text-1 font-semibold">
            {plan.credits.toLocaleString()} / mo
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-3">Resolution</span>
          <span className="text-text-1 font-medium">{plan.resolution}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-3">~Generations</span>
          <span className="text-text-2">{plan.maxGens}</span>
        </div>
      </div>

      {/* CTA */}
      <Link href={plan.ctaLink} className="block">
        {plan.highlighted ? (
          <Button className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors duration-150 cursor-pointer shadow-[0_0_20px_rgba(255,107,0,0.25)]">
            {plan.cta}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-glass-border text-text-1 hover:bg-glass-hover rounded-full transition-colors duration-150 cursor-pointer"
          >
            {plan.cta}
          </Button>
        )}
      </Link>

      {/* Feature list */}
      <ul className="space-y-2.5 mt-auto">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm">
            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <span className="text-text-2">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-20 pb-24 sm:py-28 sm:pb-28">
      {/* Header */}
      <div className="text-center mb-12 max-w-xl">
        <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 rounded-full text-xs font-medium">
          Credit-Based Pricing
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-1 leading-tight mb-4">
          Build prompts for free.<br />
          <span className="text-accent">Generate at any scale.</span>
        </h1>
        <p className="text-text-2 text-base leading-relaxed">
          Start without an account. Choose the plan that matches your creative output —
          from quick previews to 4K production-quality batches.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-10">
        <span
          className={cn(
            "text-sm transition-colors",
            !yearly ? "text-text-1 font-medium" : "text-text-3",
          )}
        >
          Monthly
        </span>
        <button
          role="switch"
          aria-checked={yearly}
          aria-label="Toggle annual billing"
          onClick={() => setYearly((v) => !v)}
          className={cn(
            "relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            yearly ? "bg-accent" : "bg-bg-3 border border-glass-border",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
              yearly && "translate-x-5",
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm transition-colors flex items-center gap-1.5",
            yearly ? "text-text-1 font-medium" : "text-text-3",
          )}
        >
          Annually
          <span className="text-[11px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
            Save ~{YEARLY_SAVINGS_PCT}%
          </span>
        </span>
      </div>

      {/* Credit cost reference */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 text-xs text-text-3">
        <span>1K standard = <span className="text-text-2 font-medium">10 cr</span></span>
        <span className="text-border-strong">•</span>
        <span>HD 1K–2K = <span className="text-text-2 font-medium">35 cr</span></span>
        <span className="text-border-strong">•</span>
        <span>4K max = <span className="text-text-2 font-medium">65 cr</span></span>
      </div>

      {/* Plan cards */}
      <div className="w-full max-w-6xl grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} yearly={yearly} />
        ))}
      </div>

      {/* Full feature comparison table */}
      <div className="w-full max-w-5xl mb-16">
        <h2 className="font-heading text-lg font-semibold text-text-1 mb-4">
          Full comparison
        </h2>
        <div className="bg-bg-2 border border-glass-border rounded-[var(--radius-lg)] overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-5 py-3 text-text-3 font-medium text-xs uppercase tracking-wide">
                  Feature
                </th>
                <th className="px-4 py-3 text-center text-text-2 font-medium">Free</th>
                <th className="px-4 py-3 text-center text-text-2 font-medium">Starter</th>
                <th className="px-4 py-3 text-center text-accent font-semibold">Pro</th>
                <th className="px-4 py-3 text-center text-accent-gold font-semibold">Studio</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((f, i) => (
                <tr
                  key={f.label}
                  className={cn(
                    "border-b border-glass-border last:border-0 transition-colors duration-100",
                    i % 2 === 0 ? "bg-transparent" : "bg-bg-3/30",
                  )}
                >
                  <td className="px-5 py-3 text-text-1 font-medium whitespace-nowrap">
                    {f.label}
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell value={f.free} />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell value={f.starter} />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell value={f.pro} />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell value={f.studio} />
                  </td>
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
          <a
            href="mailto:hello@sidekickprompt.com"
            className="text-accent hover:underline"
          >
            hello@sidekickprompt.com
          </a>
        </p>
      </div>
    </div>
  );
}
