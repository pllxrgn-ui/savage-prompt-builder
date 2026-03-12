"use client";

import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  /** Gap between dots in px */
  gap?: number;
  /** Dot radius in px */
  radius?: number;
  /** Dot color — defaults to accent */
  color?: string;
}

export function DotPattern({
  className,
  gap = 24,
  radius = 0.5,
  color = "var(--accent)",
}: DotPatternProps) {
  const id = "dot-pattern";
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-current",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          width={gap}
          height={gap}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle cx={gap / 2} cy={gap / 2} r={radius} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
