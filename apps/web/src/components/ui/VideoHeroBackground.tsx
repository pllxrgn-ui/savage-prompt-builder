"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Curated royalty-free stock video URLs (Pexels CDN — free to use).
 * Rotate randomly on each mount.
 */
const DEFAULT_VIDEOS = [
  "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",  // abstract dark particles
  "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",  // dark abstract motion
  "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",  // dark abstract smoke
];

/** Electric / energy videos — hero sections with power/superhero vibe */
export const HERO_ENERGY_VIDEOS = [
  "https://videos.pexels.com/video-files/3466611/3466611-hd_1920_1080_30fps.mp4",   // electric energy
  "https://videos.pexels.com/video-files/7846338/7846338-hd_2048_1080_25fps.mp4",   // electric arcs
  "https://videos.pexels.com/video-files/5838621/5838621-uhd_2560_1440_30fps.mp4",  // city skyline night
];

/** Cosmic / atmospheric — login & auth pages */
export const AUTH_VIDEOS = [
  "https://videos.pexels.com/video-files/5818973/5818973-hd_1920_1080_24fps.mp4",   // stars / cosmic
  "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",  // abstract dark particles
  "https://videos.pexels.com/video-files/1727802/1727802-uhd_3840_2160_30fps.mp4",  // electric UHD
];

interface VideoHeroBackgroundProps {
  /** Custom video pool — defaults to abstract dark set */
  videos?: string[];
  /** Video opacity when loaded (0–100). Default: 20 */
  opacity?: number;
  /** Show built-in gradient overlay. Default: true */
  overlay?: boolean;
}

export function VideoHeroBackground({ videos, opacity = 20, overlay = true }: VideoHeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const pool = videos ?? DEFAULT_VIDEOS;
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [videoSrc] = useState(
    () => pool[Math.floor(Math.random() * pool.length)]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Fallback: if onCanPlay fired before hydration, check readyState
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setLoaded(true);
    }
  }, []);

  if (prefersReduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${loaded ? `opacity-${opacity}` : "opacity-0"}`}
        // Inline style fallback for arbitrary opacity values
        style={loaded ? { opacity: opacity / 100 } : { opacity: 0 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Subtle base overlay — parent controls additional darkening */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/40 via-bg-base/20 to-bg-base/60" />
      )}
    </div>
  );
}
