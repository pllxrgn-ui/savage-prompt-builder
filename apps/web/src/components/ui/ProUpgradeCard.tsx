"use client";

import { Crown } from "lucide-react";
import { clsx } from "clsx";

interface ProUpgradeCardProps {
  feature: string;
  description?: string;
  className?: string;
}

export function ProUpgradeCard({ feature, description, className }: ProUpgradeCardProps) {
  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-center p-6 rounded-xl",
        "bg-bg-2/80 backdrop-blur border border-accent/20 text-center",
        className,
      )}
    >
      <div className="p-3 rounded-full bg-accent/15 mb-3">
        <Crown className="w-6 h-6 text-accent" />
      </div>
      <p className="text-sm font-semibold text-text-1 mb-1">{feature}</p>
      {description && (
        <p className="text-xs text-text-3 mb-4 max-w-xs">{description}</p>
      )}
      <button
        className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Upgrade to Pro
      </button>
    </div>
  );
}
