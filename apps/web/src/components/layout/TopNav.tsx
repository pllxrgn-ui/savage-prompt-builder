"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  Wand2,
  Sparkles,
  BookOpen,
  Settings,
  Moon,
  Sun,
  Crown,
  LogOut,
  Zap,
  ChevronDown,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── Nav configuration ── */
const NAV_ITEMS = [
  { href: "/moodboard", label: "Moodboard", icon: ImageIcon, badge: null },
  { href: "/builder",  label: "Builder",  icon: Wand2,    badge: null },
  { href: "/generate", label: "Generate", icon: Sparkles, badge: null },
  { href: "/library",  label: "Library",  icon: BookOpen, badge: null },
] as const;

/* ── Desktop nav link ── */
function NavLink({
  href,
  label,
  icon: Icon,
  badge,
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer",
        isActive
          ? "text-text-1 bg-bg-3 border border-glass-border-strong"
          : "text-text-3 hover:text-text-1 hover:bg-glass border border-transparent",
      )}
    >
      <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-accent" : "")} />
      {label}
      {badge && (
        <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-accent text-white leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ── User menu ── */
function UserMenu() {
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
    return (
      <Link
        href="/login"
        className="px-4 py-1.5 rounded-full text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
      >
        Sign In
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-glass transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-accent/50 cursor-pointer border border-transparent hover:border-glass-border"
          aria-label="User menu"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-glass-border"
            />
          ) : (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-semibold">
              {initials}
            </div>
          )}
          {isPro && <Crown className="w-3.5 h-3.5 text-accent-gold" />}
          <ChevronDown className="w-3 h-3 text-text-3 group-hover:text-text-2 transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 bg-bg-2 border border-glass-border rounded-[var(--radius-xl)] p-1 shadow-lg"
      >
        <div className="px-3 py-2.5 mb-1">
          <p className="text-sm font-semibold text-text-1 truncate">{user.name}</p>
          <p className="text-xs text-text-3 truncate">{user.email}</p>
          {isPro ? (
            <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-gold/10 w-fit">
              <Crown className="w-3 h-3 text-accent-gold" />
              <span className="text-[11px] font-semibold text-accent-gold">Pro Member</span>
            </div>
          ) : (
            <Link
              href="/settings"
              className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold w-fit hover:bg-accent/20 transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              Upgrade to Pro
            </Link>
          )}
        </div>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem asChild className="rounded-[var(--radius-md)] cursor-pointer focus:bg-glass">
          <Link href="/settings" className="flex items-center gap-2 text-sm text-text-2">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem
          onClick={logout}
          className="rounded-[var(--radius-md)] cursor-pointer focus:bg-red-500/10 text-red-400 focus:text-red-400"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Mobile bottom tab bar ── */
const MOBILE_TABS = [
  { href: "/home",      label: "Home",      icon: Flame },
  { href: "/moodboard", label: "Mood",      icon: ImageIcon },
  { href: "/builder",   label: "Builder",   icon: Wand2 },
  { href: "/generate",  label: "Generate",  icon: Sparkles },
  { href: "/library",   label: "Library",   icon: BookOpen },
] as const;

/* ── Mobile top bar (profile icon) ── */
export function MobileTopBar() {
  const { user, isPro, isAuthenticated } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="md:hidden flex items-center justify-between h-12 px-4 sticky top-0 z-50 bg-bg-base/80 backdrop-blur-2xl border-b border-glass-border">
      <Link href="/home" className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center justify-center w-6 h-6 rounded-[var(--radius-sm)] bg-accent/15">
          <Flame className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="font-display font-bold text-sm text-text-1 tracking-tight">SAVAGE</span>
      </Link>

      {isAuthenticated && user ? (
        <Link href="/settings" className="cursor-pointer" aria-label="Profile">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-glass-border"
            />
          ) : (
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-semibold">
              {initials}
              {isPro && <Crown className="absolute -top-0.5 -right-0.5 w-3 h-3 text-accent-gold" />}
            </div>
          )}
        </Link>
      ) : (
        <Link
          href="/login"
          className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
        >
          Sign In
        </Link>
      )}
    </header>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around
        bg-bg-1/95 backdrop-blur-2xl border-t border-glass-border h-16 px-2 safe-area-bottom"
      aria-label="Mobile navigation"
    >
      {MOBILE_TABS.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/home" && pathname?.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[48px] py-2 rounded-2xl transition-colors cursor-pointer",
              isActive ? "text-accent" : "text-text-3 hover:text-text-2",
            )}
            aria-label={label}
          >
            <Icon className="w-5 h-5" />
            <span className={cn("text-[10px] font-medium", isActive && "text-accent")}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Desktop top nav ── */
export function TopNav() {
  const pathname = usePathname();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const router = useRouter();

  return (
    <TooltipProvider delayDuration={0}>
      <header
        className="hidden md:flex items-center justify-between h-14 px-6 sticky top-0 z-50
          bg-bg-base/80 backdrop-blur-2xl border-b border-glass-border"
      >
        {/* Left: Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2.5 group mr-10 shrink-0 cursor-pointer"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-md)] bg-accent/15 group-hover:bg-accent/25 transition-colors">
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display font-bold text-[15px] text-text-1 tracking-tight">
            SAVAGE
          </span>
        </Link>

        {/* Center: Nav items */}
        <nav className="flex items-center gap-0.5 flex-1" aria-label="Primary navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive =
              pathname === href || pathname?.startsWith(href);
            return (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={Icon}
                badge={badge}
                isActive={isActive}
              />
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Prompt Polish — primary value prop CTA */}
          <button
            onClick={() => router.push("/builder")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
              bg-accent text-white hover:bg-accent-hover
              transition-all duration-150 shadow-sm hover:shadow-[0_0_16px_rgba(255,107,0,0.35)]
              shrink-0 cursor-pointer border border-accent/30"
          >
            <Zap className="w-3.5 h-3.5" />
            Polish
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/25 leading-none">
              AI
            </span>
          </button>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-text-3 hover:text-text-1 hover:bg-glass rounded-full cursor-pointer"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-xl text-xs">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          {/* User menu */}
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  );
}
