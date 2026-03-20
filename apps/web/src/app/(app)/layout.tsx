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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <AmbientGlow />
      <MobileTopBar />
      <TopNav />
      <main id="main-content" className="flex-1 relative">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>
      <MobileTabBar />
      <ToastProvider />
    </>
  );
}
