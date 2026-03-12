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

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  "/home": { title: "Home", subtitle: "Dashboard" },
  "/builder": { title: "Builder", subtitle: "Create prompts" },
  "/library": { title: "Library", subtitle: "Saved work" },
  "/settings": { title: "Settings", subtitle: "Preferences" },
};

export function TopBar() {
  const pathname = usePathname();
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);

  const meta = PAGE_META[pathname ?? ""] ?? { title: "Savage Prompt Builder" };

  return (
    <header className="flex items-center justify-between h-14 px-6 md:px-8 border-b border-border bg-bg-1/80 backdrop-blur-md sticky top-0 z-30">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-heading font-semibold text-text-1">{meta.title}</h1>
        {meta.subtitle && (
          <>
            <span className="text-text-3">/</span>
            <span className="text-sm text-text-3">{meta.subtitle}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-text-3 hover:text-text-1 hover:bg-surface rounded-lg"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Moon className="w-[18px] h-[18px]" />
                ) : (
                  <Sun className="w-[18px] h-[18px]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-sm">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
