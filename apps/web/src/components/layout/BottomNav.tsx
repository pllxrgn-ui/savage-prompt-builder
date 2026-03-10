"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Wand2, BookOpen, Settings } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/builder", label: "Builder", icon: Wand2 },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={clsx(
        "md:hidden fixed bottom-0 left-0 right-0 z-40",
        "flex items-center justify-around",
        "h-16 bg-bg-1/95 backdrop-blur-xl",
        "border-t border-border",
        "safe-area-bottom",
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname?.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 flex-1 py-2",
              "transition-colors duration-200",
              isActive ? "text-accent" : "text-text-3",
            )}
          >
            <Icon className={clsx("w-5 h-5", isActive && "text-accent")} />
            <span className="text-[10px] font-medium">{label}</span>

            {/* Active dot */}
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] bg-accent rounded-b-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
