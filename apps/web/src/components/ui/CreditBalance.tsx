"use client";

import { Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreditBalanceProps {
  compact?: boolean;
  className?: string;
}

export function CreditBalance({ compact = false, className }: CreditBalanceProps) {
  const { credits, isPro, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const isLow = credits <= 10;
  const isEmpty = credits === 0;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors",
          isEmpty
            ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : isLow
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-accent/10 text-accent border border-accent/20",
          className,
        )}
      >
        <Zap className="w-3 h-3" />
        {credits}
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
            isEmpty
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : isLow
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-accent/10 text-accent border border-accent/20",
            className,
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{credits}</span>
          {isPro && <Crown className="w-3 h-3 text-accent-gold" />}
        </div>
      </TooltipTrigger>
      <TooltipContent className="rounded-xl text-xs">
        {isEmpty
          ? "No credits remaining — upgrade or wait for refresh"
          : `${credits} generation credits remaining`}
      </TooltipContent>
    </Tooltip>
  );
}
