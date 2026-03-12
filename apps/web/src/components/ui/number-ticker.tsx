"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(direction === "down" ? value : 0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setTimeout(() => {
            const startVal = direction === "down" ? value : 0;
            const endVal = direction === "down" ? 0 : value;
            const duration = 1500;
            const startTime = performance.now();

            function update(now: number) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = startVal + (endVal - startVal) * eased;
              setDisplayed(current);
              if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, direction, delay, hasStarted]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {displayed.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    </span>
  );
}
