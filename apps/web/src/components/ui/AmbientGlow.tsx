"use client";

/**
 * Subtle ambient background glow for the Warm Dark Elegance theme.
 * Renders 3 slow-drifting radial gradient blobs (orange, violet, muted)
 * behind all page content. Uses pure CSS animations — no JS runtime cost.
 * Respects prefers-reduced-motion by pausing animations.
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Warm orange glow — top-left drift */}
      <div className="ambient-blob ambient-blob-1 absolute -left-[20%] -top-[10%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.07)_0%,transparent_70%)]" />

      {/* Violet / AI glow — bottom-right drift */}
      <div className="ambient-blob ambient-blob-2 absolute -bottom-[15%] -right-[15%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.06)_0%,transparent_70%)]" />

      {/* Neutral warm fill — center drift */}
      <div className="ambient-blob ambient-blob-3 absolute left-[30%] top-[40%] h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.04)_0%,transparent_70%)]" />
    </div>
  );
}
