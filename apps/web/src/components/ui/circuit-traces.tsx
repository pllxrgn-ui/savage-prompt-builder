"use client";

import { cn } from "@/lib/utils";

interface CircuitTracesProps {
  className?: string;
}

/**
 * Animated PCB-style circuit traces overlay.
 * Pure SVG + CSS — no JS animation frames.
 * Renders fixed-position traces at very low opacity
 * with a travelling energy pulse along each path.
 */
export function CircuitTraces({ className }: CircuitTracesProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 h-full w-full z-[1]",
        className,
      )}
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
    >
      <defs>
        {/* The "energy dot" that travels along paths */}
        <circle id="dot" r="2" fill="var(--accent)" />

        {/* Soft glow for the dot */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === Static trace lines (the "copper") === */}
      <g
        stroke="var(--accent)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.06"
      >
        {/* Top-left cluster */}
        <path d="M 0 120 H 80 V 200 H 160" />
        <path d="M 0 124 H 60 V 280 H 120 V 320" />
        <path d="M 40 0 V 60 H 120 V 140" />

        {/* Top-right cluster */}
        <path d="M 1440 80 H 1340 V 160 H 1280" />
        <path d="M 1440 84 H 1360 V 220 H 1300 V 280" />
        <path d="M 1380 0 V 40 H 1300 V 120" />

        {/* Bottom-left cluster */}
        <path d="M 0 700 H 100 V 780 H 200" />
        <path d="M 0 704 H 70 V 820 H 160 V 860" />
        <path d="M 60 900 V 840 H 140 V 760" />

        {/* Bottom-right cluster */}
        <path d="M 1440 720 H 1320 V 800 H 1260" />
        <path d="M 1440 724 H 1350 V 840 H 1280 V 900" />
        <path d="M 1380 900 V 860 H 1300 V 780" />

        {/* Mid-left vertical run */}
        <path d="M 20 300 V 500 H 80 V 600" />

        {/* Mid-right vertical run */}
        <path d="M 1420 320 V 520 H 1360 V 620" />

        {/* Junction nodes (small squares at corners) */}
        <rect x="78" y="198" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="118" y="278" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="1278" y="158" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="1298" y="278" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="198" y="778" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="1258" y="798" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="78" y="498" width="4" height="4" fill="var(--accent)" opacity="0.3" />
        <rect x="1358" y="518" width="4" height="4" fill="var(--accent)" opacity="0.3" />
      </g>

      {/* === Animated energy pulses travelling along traces === */}
      <g filter="url(#glow)" opacity="0.4">
        {/* Pulse 1 — top-left horizontal */}
        <use href="#dot">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M 0 120 H 80 V 200 H 160"
          />
        </use>

        {/* Pulse 2 — top-right horizontal */}
        <use href="#dot">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M 1440 80 H 1340 V 160 H 1280"
            begin="1s"
          />
        </use>

        {/* Pulse 3 — bottom-left */}
        <use href="#dot">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M 0 700 H 100 V 780 H 200"
            begin="2s"
          />
        </use>

        {/* Pulse 4 — bottom-right */}
        <use href="#dot">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M 1440 720 H 1320 V 800 H 1260"
            begin="3s"
          />
        </use>

        {/* Pulse 5 — mid-left vertical */}
        <use href="#dot">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path="M 20 300 V 500 H 80 V 600"
            begin="1.5s"
          />
        </use>

        {/* Pulse 6 — mid-right vertical */}
        <use href="#dot">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path="M 1420 320 V 520 H 1360 V 620"
            begin="4s"
          />
        </use>

        {/* Pulse 7 — top-left diagonal run */}
        <use href="#dot">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M 40 0 V 60 H 120 V 140"
            begin="0.5s"
          />
        </use>

        {/* Pulse 8 — bottom-left upward */}
        <use href="#dot">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M 60 900 V 840 H 140 V 760"
            begin="2.5s"
          />
        </use>
      </g>
    </svg>
  );
}
