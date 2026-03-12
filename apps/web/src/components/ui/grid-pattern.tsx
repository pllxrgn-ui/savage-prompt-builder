"use client";

import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  /** Cell size in px */
  size?: number;
  /** Line color */
  color?: string;
}

export function GridPattern({
  className,
  size = 24,
  color = "var(--border)",
}: GridPatternProps) {
  const id = "grid-pattern";
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
