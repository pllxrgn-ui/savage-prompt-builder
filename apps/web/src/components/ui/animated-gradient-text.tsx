"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center",
        "rounded-full px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_rgba(255,107,0,0.08)]",
        "backdrop-blur-sm transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_rgba(255,107,0,0.2)]",
        "border border-glass-border bg-bg-2/60",
        className,
      )}
    >
      <div
        className="absolute inset-0 block h-full w-full animate-gradient rounded-full bg-gradient-to-r from-accent/20 via-accent2/20 to-accent/20 bg-[length:var(--bg-size,300%)_100%] [border-radius:inherit] mask-border-gradient"
      />
      {children}
    </div>
  );
}
