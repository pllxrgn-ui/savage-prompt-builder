"use client";

/**
 * Cinematic aurora background — slow-drifting gradient blobs
 * Pure CSS animations, no canvas or JS overhead.
 */
export function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-bg-base)_70%)]" />

      {/* Primary orange bloom — top center, drifts right */}
      <div className="absolute top-[15%] left-[40%] w-[700px] h-[500px] rounded-full bg-accent/[0.045] blur-[140px] animate-aurora-1" />

      {/* Violet accent — bottom left, drifts up */}
      <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-accent2/[0.04] blur-[120px] animate-aurora-2" />

      {/* Gold warm glow — right side, subtle drift */}
      <div className="absolute top-[45%] right-[10%] w-[400px] h-[350px] rounded-full bg-accent-gold/[0.03] blur-[100px] animate-aurora-3" />

      {/* Soft orange — center, slow pulse */}
      <div className="absolute top-[55%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/[0.025] blur-[160px] animate-aurora-4" />
    </div>
  );
}
