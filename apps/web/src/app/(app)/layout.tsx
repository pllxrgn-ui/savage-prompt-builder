"use client";

import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { GridPattern } from "@/components/ui/grid-pattern";
import { CircuitTraces } from "@/components/ui/circuit-traces";
import { useUIStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  useKeyboardShortcuts();

  return (
    <>
      <Sidebar />
      <MobileNav />
      <div
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300 ease-out",
          collapsed ? "md:ml-[60px]" : "md:ml-[200px]",
        )}
      >
        <TopBar />
        <main className="flex-1 relative">
          <GridPattern className="opacity-[0.03] fixed" size={32} />
          <CircuitTraces />
          {children}
        </main>
      </div>
      <ToastProvider />
    </>
  );
}
