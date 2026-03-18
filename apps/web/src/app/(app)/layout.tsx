"use client";

import { TopNav, MobileTopBar, MobileTabBar } from "@/components/layout/TopNav";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { PageTransitionWrapper } from "@/components/ui/AnimatedLayout";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  return (
    <>
      <AmbientGlow />
      <MobileTopBar />
      <TopNav />
      <main className="flex-1 relative pb-16 md:pb-0">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>
      <MobileTabBar />
      <ToastProvider />
    </>
  );
}
