"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationGateProps {
  visible: boolean;
  onRate: (rating: "up" | "down") => void;
  onDismiss: () => void;
  autoHideMs?: number;
}

export function ValidationGate({
  visible,
  onRate,
  onDismiss,
  autoHideMs = 10000,
}: ValidationGateProps) {
  const [rated, setRated] = useState<"up" | "down" | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  // Reset when visibility changes (render-time adjustment — avoids cascading effect)
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setRated(null);
  }

  // Auto-dismiss after timeout
  useEffect(() => {
    if (!visible || rated) return;
    const timer = setTimeout(onDismiss, autoHideMs);
    return () => clearTimeout(timer);
  }, [visible, rated, autoHideMs, onDismiss]);

  const handleRate = useCallback(
    (value: "up" | "down") => {
      setRated(value);
      onRate(value);
      // Brief pause to show feedback, then dismiss
      setTimeout(onDismiss, 800);
    },
    [onRate, onDismiss],
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-bg-2 border border-glass-border shadow-lg backdrop-blur-xl"
        >
          <span className="text-xs text-text-2 font-medium">
            {rated ? "Thanks!" : "How was this result?"}
          </span>

          {!rated && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRate("up")}
                className={cn(
                  "p-1.5 rounded-full transition-colors cursor-pointer",
                  "hover:bg-emerald-500/15 hover:text-emerald-400",
                  "text-text-3",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                )}
                aria-label="Good result"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRate("down")}
                className={cn(
                  "p-1.5 rounded-full transition-colors cursor-pointer",
                  "hover:bg-red-500/15 hover:text-red-400",
                  "text-text-3",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                )}
                aria-label="Bad result"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {rated && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "p-1.5 rounded-full",
                rated === "up"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400",
              )}
            >
              {rated === "up" ? (
                <ThumbsUp className="w-4 h-4" />
              ) : (
                <ThumbsDown className="w-4 h-4" />
              )}
            </motion.div>
          )}

          {!rated && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-full text-text-3 hover:text-text-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
