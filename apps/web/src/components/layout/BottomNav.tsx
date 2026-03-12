"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Wand2, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40",
        "flex items-center justify-around",
        "h-14 bg-bg-1/95 backdrop-blur-xl",
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
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5",
              "transition-colors duration-150 relative",
              isActive ? "text-accent" : "text-text-2",
            )}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] bg-accent rounded-b-full" />
            )}
            <Icon className={cn("w-[18px] h-[18px]", isActive && "text-accent")} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
