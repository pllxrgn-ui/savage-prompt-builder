/**
 * Custom SVG garment icons for clothing types that don't have
 * matching Lucide/Phosphor equivalents.
 * 24×24 viewBox, stroke-based to match Lucide/Phosphor style.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Sleeveless top with wide straps */
export function TankTopIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M88 16 L56 56 L56 232 L200 232 L200 56 L168 16" />
      <path d="M88 16 C88 16 104 48 128 48 C152 48 168 16 168 16" />
    </svg>
  );
}

/** Shirt with emphasized long sleeves */
export function LongSleeveIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M96 16 L16 56 L32 96 L72 80 L72 232 L184 232 L184 80 L224 96 L240 56 L160 16" />
      <path d="M96 16 C96 16 112 44 128 44 C144 44 160 16 160 16" />
      {/* Cuff lines to emphasize long sleeves */}
      <line x1="16" y1="56" x2="32" y2="52" />
      <line x1="240" y1="56" x2="224" y2="52" />
    </svg>
  );
}

/** Above-knee shorts */
export function ShortsIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Waistband */}
      <line x1="48" y1="48" x2="208" y2="48" />
      {/* Left leg */}
      <path d="M48 48 L40 168 L120 168 L128 96" />
      {/* Right leg */}
      <path d="M208 48 L216 168 L136 168 L128 96" />
    </svg>
  );
}

/** Jacket with collar and front opening */
export function JacketIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Body outline with sleeves */}
      <path d="M96 16 L16 56 L32 96 L72 80 L72 232 L184 232 L184 80 L224 96 L240 56 L160 16" />
      {/* Collar */}
      <path d="M96 16 L112 52 L128 36 L144 52 L160 16" />
      {/* Center zipper line */}
      <line x1="128" y1="36" x2="128" y2="232" />
    </svg>
  );
}

/** Athletic jersey with V-neck and number */
export function JerseyIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Body outline with short sleeves */}
      <path d="M96 16 L32 48 L48 96 L80 80 L80 232 L176 232 L176 80 L208 96 L224 48 L160 16" />
      {/* V-neck */}
      <path d="M96 16 L128 64 L160 16" />
      {/* Number hint (horizontal stripes) */}
      <line x1="104" y1="128" x2="152" y2="128" />
      <line x1="104" y1="152" x2="152" y2="152" />
    </svg>
  );
}
