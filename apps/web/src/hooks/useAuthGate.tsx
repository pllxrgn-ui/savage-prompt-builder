"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Auth gate — like useProGate but for unauthenticated users.
 * Wraps interactive actions on the greeter dashboard:
 * if authenticated → executes action; if not → shows sign-in modal.
 */
export function useAuthGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showGate, setShowGate] = useState(false);
  const router = useRouter();

  /** Wrap any action: runs it if authenticated, shows gate if not */
  const requireAuth = useCallback(
    <T extends unknown[]>(action: (...args: T) => void) => {
      return (...args: T) => {
        if (isAuthenticated) {
          action(...args);
        } else {
          setShowGate(true);
        }
      };
    },
    [isAuthenticated],
  );

  /** The modal component — render once in the page */
  function AuthGateModal() {
    return (
      <Dialog open={showGate} onOpenChange={setShowGate}>
        <DialogContent className="max-w-sm rounded-[var(--radius-xl)] bg-bg-2 border border-glass-border p-0 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-accent via-accent2 to-accent" />

          <div className="px-6 pt-5 pb-6 space-y-5">
            <DialogHeader className="items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 mb-3">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <DialogTitle className="text-xl font-display">
                Sign in to start creating
              </DialogTitle>
              <DialogDescription className="text-text-2 text-sm leading-relaxed">
                Create an account or sign in to build prompts, save your work, and generate images with AI.
              </DialogDescription>
            </DialogHeader>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: Sparkles, text: "20+ Templates" },
                { icon: Flame, text: "AI Polish" },
                { icon: ArrowRight, text: "One-Click Generate" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-glass border border-glass-border text-text-3 text-[11px] font-medium"
                >
                  <Icon className="w-3 h-3 text-accent" />
                  {text}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowGate(false);
                  router.push("/login?mode=signup");
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold
                  hover:bg-accent-hover transition-colors duration-150 cursor-pointer shadow-lg shadow-accent/20"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowGate(false);
                  router.push("/login");
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-glass border border-glass-border text-text-1 text-sm font-semibold
                  hover:bg-glass-hover hover:border-glass-border-strong transition-colors duration-150 cursor-pointer"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-[11px] text-text-3">
              No credit card required · Free tier available
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return {
    isAuthenticated,
    requireAuth,
    showGate,
    setShowGate,
    AuthGateModal,
  };
}
