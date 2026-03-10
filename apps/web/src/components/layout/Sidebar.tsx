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
  LogOut,
  Flame,
} from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, isPro, isAuthenticated, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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

      {/* User section */}
      {isAuthenticated && user && (
        <div className="border-t border-border px-2 py-3">
          <div className="flex items-center gap-2.5 px-2">
            {/* Avatar */}
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent text-xs font-bold shrink-0">
                {initials}
              </div>
            )}

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-1 truncate">{user.name}</p>
                  <span
                    className={clsx(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      isPro
                        ? "bg-accent/15 text-accent"
                        : "bg-surface text-text-3",
                    )}
                  >
                    {isPro ? "Pro" : "Free"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-7 h-7 rounded-md text-text-3 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                  aria-label="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
