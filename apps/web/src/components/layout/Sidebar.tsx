"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Wand2,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  BrainCircuit,
  Gauge,
  Flame,
} from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/builder", label: "Builder", icon: Wand2 },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col h-screen fixed left-0 top-0 z-40",
        "bg-bg-1 border-r border-border transition-all duration-300 ease-out",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      {/* Logo + Collapse toggle */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/15">
            <Flame className="w-4 h-4 text-accent" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-sm text-text-1 tracking-tight whitespace-nowrap">
              Savage Prompt
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-7 h-7 rounded-md text-text-3 hover:text-text-1 hover:bg-surface transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sm font-medium group relative",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-2 hover:text-text-1 hover:bg-surface",
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-accent" : "text-text-3 group-hover:text-text-1",
                )}
              />
              {!collapsed && <span>{label}</span>}

              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
