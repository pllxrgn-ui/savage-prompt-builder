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
  Crown,
  Menu,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/home", label: "HOME", icon: Home, shortcut: "01" },
  { href: "/builder", label: "BUILDER", icon: Wand2, shortcut: "02" },
  { href: "/library", label: "LIBRARY", icon: BookOpen, shortcut: "03" },
  { href: "/settings", label: "SETTINGS", icon: Settings, shortcut: "04" },
] as const;

/* ── Terminal-style nav link ── */
function NavLink({
  href,
  label,
  icon: Icon,
  shortcut,
  isActive,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  isActive: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 transition-all duration-150 group relative",
        "text-[11px] font-medium tracking-[0.08em] uppercase",
        isActive
          ? "text-accent bg-accent/8 border-l-2 border-accent"
          : "text-text-3 hover:text-text-1 hover:bg-white/[0.02] border-l-2 border-transparent",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          isActive ? "text-accent" : "text-text-3 group-hover:text-accent/60",
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 font-mono">{label}</span>
          <span className={cn(
            "text-[9px] font-mono",
            isActive ? "text-accent/60" : "text-text-3/30",
          )}>
            [{shortcut}]
          </span>
        </>
      )}
    </Link>
  );
}

/* ── Logo block — terminal style ── */
function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/home" className="flex items-center gap-2 group">
      <div className="relative flex items-center justify-center w-8 h-8 border border-accent/30 group-hover:border-accent/60 transition-colors">
        <Flame className="w-4 h-4 text-accent relative z-10" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-heading font-bold text-[13px] text-accent tracking-tight whitespace-nowrap uppercase">
            SAVAGE
          </span>
          <span className="text-[8px] text-text-3 tracking-[0.15em] font-mono uppercase">
            PROMPT BUILDER
          </span>
        </div>
      )}
    </Link>
  );
}

/* ── User section — terminal ── */
function UserSection({
  collapsed,
}: {
  collapsed?: boolean;
}) {
  const { user, isPro, isAuthenticated, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (!isAuthenticated || !user) {
    if (collapsed) return null;
    return (
      <div className="px-3 py-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-[10px] uppercase tracking-widest text-accent border-accent/30 hover:border-accent hover:bg-accent/10 font-mono"
        >
          <Link href="/login">&gt;_ SIGN IN</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02] transition-colors",
      collapsed && "justify-center px-0",
    )}>
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-6 h-6 object-cover shrink-0 border border-accent/20"
        />
      ) : (
        <div className="flex items-center justify-center w-6 h-6 bg-accent/10 text-accent text-[9px] font-bold font-mono shrink-0 border border-accent/20">
          {initials}
        </div>
      )}

      {!collapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono font-medium text-text-2 truncate leading-tight uppercase tracking-wider">
              {user.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isPro && <Crown className="w-2.5 h-2.5 text-accent" />}
              <span className={cn(
                "text-[9px] font-mono tracking-widest",
                isPro ? "text-accent" : "text-text-3",
              )}>
                {isPro ? "[PRO]" : "[FREE]"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-text-3 hover:text-red-400 hover:bg-red-400/10 shrink-0"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </>
      )}
    </div>
  );
}

/* ── Desktop Sidebar — Blaster Terminal ── */
export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 z-40",
          "bg-bg-1 border-r border-accent/10 transition-all duration-300 ease-out",
          collapsed ? "w-[60px]" : "w-[200px]",
        )}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between px-3 h-12">
          <Logo collapsed={collapsed} />
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-text-3 hover:text-accent"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Orange divider */}
        <div className="mx-3 h-px bg-accent/10" />

        {/* Section label */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-1">
            <span className="text-[8px] font-mono text-text-3 tracking-[0.2em] uppercase">
              NAVIGATION
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-1 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <div>
                      <NavLink {...item} isActive={isActive} collapsed />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider"
                  >
                    {item.label}
                    <span className="text-accent/50">[{item.shortcut}]</span>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <NavLink key={item.href} {...item} isActive={isActive} />
            );
          })}
        </nav>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="px-2 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-text-3 hover:text-accent"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Footer divider */}
        <div className="mx-3 h-px bg-accent/10" />

        {/* Version tag */}
        {!collapsed && (
          <div className="px-3 py-1.5">
            <span className="text-[8px] font-mono text-text-3/30 tracking-[0.15em]">
              SPB [2026] v1.0
            </span>
          </div>
        )}

        {/* User */}
        <UserSection collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
}

/* ── Mobile Sheet Nav — Terminal Style ── */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 h-9 w-9 bg-bg-1/95 backdrop-blur-md border border-accent/20 shadow-lg hover:bg-bg-2 hover:border-accent/40"
          >
            <Terminal className="w-4 h-4 text-accent" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col p-0 w-[240px] bg-bg-1 border-r border-accent/10"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo */}
          <div className="flex items-center px-3 h-12">
            <Logo />
          </div>

          <div className="h-px bg-accent/10" />

          {/* Section label */}
          <div className="px-3 pt-4 pb-1">
            <span className="text-[8px] font-mono text-text-3 tracking-[0.2em] uppercase">
              NAVIGATION
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-1 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <NavLink
                  key={item.href}
                  {...item}
                  isActive={isActive}
                  onClick={() => setOpen(false)}
                />
              );
            })}
          </nav>

          {/* User */}
          <div className="h-px bg-accent/10" />
          <div className="py-2">
            <UserSection />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
