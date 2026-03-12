"use client";

import { InteractiveParticles } from "@/components/ui/InteractiveParticles";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-bg-base overflow-hidden">
      <InteractiveParticles />
      <AuroraBackground />
      {children}
    </div>
  );
}
