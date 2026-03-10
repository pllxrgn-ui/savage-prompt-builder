"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { useUIStore } from "@/lib/store";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { clsx } from "clsx";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  useKeyboardShortcuts();

  return (
    <>
      <Sidebar />
      <main
        className={clsx(
          "min-h-screen transition-all duration-300 ease-out",
          "pb-20 md:pb-0",
          collapsed ? "md:ml-[68px]" : "md:ml-[240px]",
        )}
      >
        {children}
      </main>
      <BottomNav />
      <ToastProvider />
    </>
  );
}
