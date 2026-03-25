"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(255, 107, 0, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap",
          "border border-white/10 px-6 py-2 text-white",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer sweep layer */}
        <div className="absolute inset-0 overflow-hidden [border-radius:var(--radius)]">
          <div className="animate-shimmer-sweep absolute inset-0 -translate-x-full [background:linear-gradient(90deg,transparent_0%,var(--shimmer-color)_50%,transparent_100%)] opacity-20" />
        </div>

        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
