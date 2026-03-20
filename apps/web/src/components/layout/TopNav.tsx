"use client";

import Link from "next/link";
<<<<<<< HEAD
import { usePathname } from "next/navigation";
=======
import { usePathname, useRouter } from "next/navigation";
>>>>>>> 555fa679dfea11fc2d332dad95f8eb89ae8b699c
import { motion } from "framer-motion";
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
import { CreditBalance } from "@/components/ui/CreditBalance";

/* ── Nav configuration ── */
const NAV_ITEMS = [
  { href: "/builder",  label: "Builder",   icon: Wand2,     badge: null },
  { href: "/moodboard", label: "Moodboard", icon: ImageIcon, badge: null },
  { href: "/generate", label: "Generate",  icon: Sparkles,  badge: null },
  { href: "/library",  label: "Library",   icon: BookOpen,  badge: null },
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
        "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer",
        isActive ? "text-text-1" : "text-text-3 hover:text-text-1 hover:bg-glass",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="pointer-events-none absolute inset-0 rounded-full bg-bg-3 border border-glass-border-strong -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
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
              href="/pricing"
              className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold w-fit hover:bg-accent/20 transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              Upgrade to Pro
            </Link>
          )}
        </div>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem asChild className="rounded-[var(--radius-md)] cursor-pointer focus:bg-glass">
          <Link href="/pricing" className="flex items-center gap-2 text-sm text-text-2">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-[var(--radius-md)] cursor-pointer focus:bg-glass">
          <Link href="/settings" className="flex items-center gap-2 text-sm text-text-2">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem
          onClick={() => { logout(); router.push("/login"); }}
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
  { href: "/home",      label: "Home",      icon: Flame,      primary: false },
  { href: "/builder",   label: "Builder",   icon: Wand2,      primary: false },
  { href: "/moodboard", label: "Mood",      icon: ImageIcon,  primary: false },
  { href: "/generate",  label: "Generate",  icon: Sparkles,   primary: false },
  { href: "/library",   label: "Library",   icon: BookOpen,   primary: false },
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
    <motion.header
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="md:hidden flex items-center justify-between h-12 px-4 sticky top-0 z-50 bg-bg-base/80 backdrop-blur-2xl border-b border-glass-border"
    >
      <Link href="/home" className="flex items-center gap-2 cursor-pointer">
        <div className="flex items-center justify-center w-6 h-6 rounded-[var(--radius-sm)] bg-accent/15">
          <Flame className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="font-display font-bold text-sm text-text-1 tracking-tight">SAVAGE</span>
      </Link>

      {isAuthenticated && user ? (
        <div className="flex items-center gap-2">
          <CreditBalance compact />
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
        </div>
      ) : (
        <Link
          href="/login"
          className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
        >
          Sign In
        </Link>
      )}
    </motion.header>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around
        bg-bg-1/95 backdrop-blur-2xl border-t border-glass-border pb-safe px-1"
      style={{ minHeight: 64 }}
      aria-label="Mobile navigation"
    >
      {MOBILE_TABS.map(({ href, label, icon: Icon, primary }) => {
        const isActive =
          pathname === href ||
          (href !== "/home" && pathname?.startsWith(href));

        if (primary) {
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="relative flex flex-col items-center -mt-5 cursor-pointer group"
            >
              {/* Elevated pill */}
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-lg transition-all duration-150 active:scale-95",
                  isActive
                    ? "bg-accent border-accent/60 shadow-[0_0_20px_rgba(255,107,0,0.45)]"
                    : "bg-bg-3 border-glass-border-strong group-hover:border-accent/40 group-hover:bg-accent/10",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-white" : "text-text-2 group-hover:text-accent",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold mt-1 mb-1 transition-colors",
                  isActive ? "text-accent" : "text-text-3 group-hover:text-text-2",
                )}
              >
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
                "flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] py-2 rounded-2xl",
                "transition-colors duration-150 cursor-pointer active:scale-95",
                isActive ? "text-accent" : "text-text-3 hover:text-text-2",
              )}
            >
            <div
              className="relative flex items-center justify-center w-8 h-8 rounded-xl"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-tab-bg"
                  className="absolute inset-0 rounded-xl bg-accent/12"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <Icon className="w-5 h-5 relative" />
            </div>
            <span className={cn("text-[10px] font-medium leading-none", isActive && "text-accent")}>
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

  return (
    <TooltipProvider delayDuration={0}>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
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
          {/* Credit balance */}
          <CreditBalance />

          {/* Pricing CTA */}
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
              bg-accent-muted text-accent hover:bg-accent/20
              border border-accent/20 hover:border-accent/35
              transition-all duration-150 shrink-0 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            Pricing
          </Link>

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
      </motion.header>
    </TooltipProvider>
  );
}
