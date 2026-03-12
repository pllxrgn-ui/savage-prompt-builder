"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Antigravity-style confetti dashes.
 * Small rotated rectangles that constantly float with gentle drift
 * and get pushed away from the cursor (repulsion zone).
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;      // dash length
  thick: number;    // dash thickness
  color: string;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  driftX: number;
  driftY: number;
}

const COLORS = [
  "255,107,0",   // accent orange
  "255,133,51",  // accent hover
  "167,139,250", // violet
  "196,181,253", // light violet
  "245,200,66",  // gold
  "251,191,36",  // warm yellow
  "251,146,60",  // soft orange
  "255,107,0",   // orange (extra weight)
];

const PARTICLE_COUNT = 140;
const MOUSE_RADIUS = 160;
const PUSH_STRENGTH = 5;

export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        len: Math.random() * 8 + 3,
        thick: Math.random() * 1.8 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        opacity: Math.random() * 0.5 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        driftX: (Math.random() - 0.5) * 0.35,
        driftY: (Math.random() - 0.5) * 0.35,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    }

    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    function animate() {
      if (!ctx || !canvas) return;

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;

      for (const p of particlesRef.current) {
        // Cursor repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) ** 2;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * PUSH_STRENGTH;
          p.vy += Math.sin(angle) * force * PUSH_STRENGTH;
        }

        // Gentle constant drift
        p.vx += p.driftX * 0.03;
        p.vy += p.driftY * 0.03;

        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx + p.driftX;
        p.y += p.vy + p.driftY;

        // Slow rotation
        p.rotation += p.rotSpeed;

        // Wrap edges
        if (p.x < -20) p.x += w + 40;
        if (p.x > w + 20) p.x -= w + 40;
        if (p.y < -20) p.y += h + 40;
        if (p.y > h + 20) p.y -= h + 40;

        // Draw rotated dash (rounded rectangle)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.roundRect(
          -p.len / 2,
          -p.thick / 2,
          p.len,
          p.thick,
          p.thick / 2,
        );
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
