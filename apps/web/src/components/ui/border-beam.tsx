"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  /** Beam size in px */
  size?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Beam color */
  color?: string;
  /** Animation delay in seconds */
  delay?: number;
}

export function BorderBeam({
  className,
  size = 80,
  duration = 6,
  color = "var(--accent)",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
      style={{
        overflow: "hidden",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "1px",
        borderRadius: "inherit",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          background: color,
          borderRadius: "50%",
          filter: `blur(${size / 3}px)`,
          opacity: 0.8,
          offsetPath: `rect(0 100% 100% 0 round ${size}px)`,
          animation: `border-beam ${duration}s linear ${delay}s infinite`,
        }}
      />
    </div>
  );
}
