import confetti from "canvas-confetti";

const BRAND_COLORS = ["#FF6B00", "#FF8533", "#A78BFA", "#F5C842"];

/** Small celebration burst — for copy, save, recipe save */
export function celebrationBurst() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
  });
}

/** Bigger burst — for generate success, first-time milestones */
export function bigCelebration() {
  const end = Date.now() + 300;
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Tiny sparkle — button click micro-interaction */
export function microSparkle(x: number, y: number) {
  confetti({
    particleCount: 12,
    spread: 30,
    startVelocity: 15,
    gravity: 0.8,
    ticks: 40,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    },
    colors: BRAND_COLORS,
    scalar: 0.6,
    disableForReducedMotion: true,
  });
}
