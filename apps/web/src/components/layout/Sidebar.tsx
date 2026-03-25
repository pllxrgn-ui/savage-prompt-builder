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
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/builder", label: "Builder", icon: Wand2 },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

/* ── Elegant nav link ── */
function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative mx-2",
        "text-sm font-medium",
        isActive
          ? "text-accent bg-accent/10"
          : "text-text-2 hover:text-text-1 hover:bg-surface",
      )}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors",
          isActive ? "text-accent" : "text-text-3 group-hover:text-text-1",
        )}
      />
      {!collapsed && (
        <span className="flex-1">{label}</span>
      )}
    </Link>
  );
}

/* ── Logo block ── */
function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/home" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
        <Flame className="w-5 h-5 text-accent relative z-10" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-[15px] text-text-1 tracking-tight uppercase">
            SIDEKICK
          </span>
          <span className="text-[11px] text-text-3 font-medium -mt-0.5">
            Prompt Builder
          </span>
        </div>
      )}
    </Link>
  );
}

/* ── User section ── */
function UserSection({
  collapsed,
}: {
  collapsed?: boolean;
}) {
  const { user, isPro, isAuthenticated, logout } = useAuth();
  const router = useRouter();

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
          className="w-full text-sm text-text-2 border-border hover:border-accent hover:text-accent"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-lg hover:bg-surface transition-colors",
      collapsed && "justify-center px-0 mx-0",
    )}>
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-border"
        />
      ) : (
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
          {initials}
        </div>
      )}

      {!collapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-1 truncate leading-tight">
              {user.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isPro && <Crown className="w-3 h-3 text-accent" />}
              <span className={cn(
                "text-xs",
                isPro ? "text-accent" : "text-text-3",
              )}>
                {isPro ? "Pro" : "Free"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-text-3 hover:text-red-400 hover:bg-red-400/10 shrink-0 rounded-lg"
            onClick={() => { logout(); router.push("/login"); }}
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </>
      )}
    </div>
  );
}

/* ── Desktop Sidebar ── */
export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 z-40",
          "bg-bg-1 border-r border-border transition-all duration-300 ease-out",
          collapsed ? "w-[68px]" : "w-[220px]",
        )}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between px-3 h-14">
          <Logo collapsed={collapsed} />
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-text-3 hover:text-text-1 rounded-lg"
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-border" />

        {/* Navigation */}
        <nav className="flex-1 py-3 space-y-1">
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
                    className="text-sm font-medium"
                  >
                    {item.label}
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
          <div className="px-2 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-text-3 hover:text-text-1 rounded-lg"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Footer divider */}
        <div className="mx-3 h-px bg-border" />

        {/* User */}
        <div className="py-2">
          <UserSection collapsed={collapsed} />
        </div>
      </aside>
    </TooltipProvider>
  );
}

/* ── Mobile Sheet Nav ── */
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
            className="fixed top-3 left-3 z-50 h-10 w-10 bg-bg-1/95 backdrop-blur-md border border-border rounded-xl shadow-lg hover:bg-bg-2"
          >
            <Menu className="w-5 h-5 text-text-1" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col p-0 w-[260px] bg-bg-1 border-r border-border"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo */}
          <div className="flex items-center px-4 h-14">
            <Logo />
          </div>

          <div className="h-px bg-border" />

          {/* Nav items */}
          <nav className="flex-1 py-3 space-y-1">
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
          <div className="h-px bg-border" />
          <div className="py-2">
            <UserSection />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
