"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#FF6B00",
  gradientOpacity = 0.08,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      cardRef.current.style.setProperty("--magic-x", `${x}px`);
      cardRef.current.style.setProperty("--magic-y", `${y}px`);
    },
    [],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={cardRef}
      style={
        {
          "--magic-size": `${gradientSize}px`,
          "--magic-color": gradientColor,
          "--magic-opacity": gradientOpacity,
          "--magic-x": "-9999px",
          "--magic-y": "-9999px",
        } as React.CSSProperties
      }
      className={cn(
        "relative overflow-hidden group",
        className,
      )}
      {...props}
    >
      {/* Spotlight gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(var(--magic-size) circle at var(--magic-x) var(--magic-y), color-mix(in srgb, var(--magic-color) calc(var(--magic-opacity) * 100%), transparent), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
