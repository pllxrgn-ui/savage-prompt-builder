"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useSettingsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PAGE_META: Record<string, { title: string; code?: string }> = {
  "/home": { title: "HOME", code: "01" },
  "/builder": { title: "BUILDER", code: "02" },
  "/library": { title: "LIBRARY", code: "03" },
  "/settings": { title: "SETTINGS", code: "04" },
};

export function TopBar() {
  const pathname = usePathname();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  const meta = PAGE_META[pathname ?? ""] ?? { title: "SPB", code: "00" };

  return (
    <header className="flex items-center justify-between h-10 px-4 md:px-6 border-b border-accent/8 bg-bg-1/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Terminal breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-[11px] tracking-wider" aria-label="Breadcrumb">
        <span className="text-accent/40 hidden sm:inline">SAVAGE.PROMPT</span>
        <span className="text-accent/20 hidden sm:inline">//</span>
        <span className="text-text-1 font-semibold uppercase">{meta.title}</span>
        {meta.code && (
          <span className="text-text-3/30 text-[9px]">[{meta.code}]</span>
        )}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Status indicator */}
        <span className="text-[9px] font-mono text-text-3/30 tracking-wider hidden md:inline">
          READY
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 hidden md:block" />

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-text-3 hover:text-accent hover:bg-accent/8"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-mono text-[10px] uppercase tracking-wider">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
