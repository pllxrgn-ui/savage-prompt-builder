"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const SHOWCASE_IMAGES = [
  { src: "/showcase/moodboard/cinematic-portrait.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/neon-still-life.jpg", width: 400, height: 400 },
  { src: "/showcase/moodboard/surreal-architecture.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/retro-street.jpg", width: 533, height: 400 },
  { src: "/showcase/moodboard/fashion-editorial.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/abstract-texture.jpg", width: 400, height: 400 },
  { src: "/showcase/moodboard/moody-interior.jpg", width: 533, height: 400 },
  { src: "/showcase/moodboard/desert-landscape.jpg", width: 533, height: 400 },
  { src: "/showcase/moodboard/cyberpunk-city.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/botanical-close.jpg", width: 400, height: 400 },
  { src: "/showcase/moodboard/vintage-car.jpg", width: 533, height: 400 },
  { src: "/showcase/moodboard/dark-luxury.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/underwater-dream.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/geometric-art.jpg", width: 400, height: 400 },
  { src: "/showcase/moodboard/foggy-forest.jpg", width: 400, height: 533 },
  { src: "/showcase/moodboard/street-mural.jpg", width: 533, height: 400 },
  { src: "/showcase/moodboard/studio-object.jpg", width: 400, height: 400 },
  { src: "/showcase/moodboard/fire-dancer.jpg", width: 400, height: 533 },
];

// Split images into columns for the masonry layout
const COLUMNS = [
  SHOWCASE_IMAGES.filter((_, i) => i % 4 === 0),
  SHOWCASE_IMAGES.filter((_, i) => i % 4 === 1),
  SHOWCASE_IMAGES.filter((_, i) => i % 4 === 2),
  SHOWCASE_IMAGES.filter((_, i) => i % 4 === 3),
];

function ShowcaseCard({ src, width, height }: (typeof SHOWCASE_IMAGES)[number]) {
  return (
    <div className="relative w-full overflow-hidden rounded-[var(--radius-md)]">
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
  );
}

interface MasonryShowcaseProps {
  className?: string;
}

export function MasonryShowcase({ className }: MasonryShowcaseProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex h-full gap-3 px-4 opacity-20">
        {COLUMNS.map((column, colIdx) => (
          <Marquee
            key={colIdx}
            vertical
            reverse={colIdx % 2 === 1}
            className="flex-1 [--duration:60s] [--gap:0.75rem] p-0"
            repeat={3}
          >
            {column.map((img) => (
              <ShowcaseCard key={img.src} {...img} />
            ))}
          </Marquee>
        ))}
      </div>

      {/* Center radial darkening for content readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.4)_70%,transparent_100%)]" />
      {/* Top and bottom gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg-base to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent" />
      {/* Side gradients */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-base to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-base to-transparent" />
    </div>
  );
}
