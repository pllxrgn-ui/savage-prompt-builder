"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedPrompt } from "@/types";

interface DiffModalProps {
  open: boolean;
  onClose: () => void;
  promptA: SavedPrompt | null;
  promptB: SavedPrompt | null;
}

interface DiffWord {
  text: string;
  type: "shared" | "only-a" | "only-b";
}

function computeWordDiff(textA: string, textB: string): DiffWord[] {
  const wordsA = textA.split(/\s+/).filter(Boolean);
  const wordsB = textB.split(/\s+/).filter(Boolean);

  // LCS-based diff for accurate word-level comparison
  const m = wordsA.length;
  const n = wordsB.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        wordsA[i - 1] === wordsB[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack to get diff
  const result: DiffWord[] = [];
  let i = m;
  let j = n;
  const temp: DiffWord[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      temp.push({ text: wordsA[i - 1]!, type: "shared" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ text: wordsB[j - 1]!, type: "only-b" });
      j--;
    } else {
      temp.push({ text: wordsA[i - 1]!, type: "only-a" });
      i--;
    }
  }

  for (let k = temp.length - 1; k >= 0; k--) {
    result.push(temp[k]!);
  }

  return result;
}

export function DiffModal({ open, onClose, promptA, promptB }: DiffModalProps) {
  const diff = useMemo(() => {
    if (!promptA || !promptB) return [];
    return computeWordDiff(promptA.content, promptB.content);
  }, [promptA, promptB]);

  const stats = useMemo(() => {
    const wordsA = promptA?.content.split(/\s+/).filter(Boolean).length ?? 0;
    const wordsB = promptB?.content.split(/\s+/).filter(Boolean).length ?? 0;
    const shared = diff.filter((d) => d.type === "shared").length;
    return { wordsA, wordsB, shared };
  }, [promptA, promptB, diff]);

  return (
    <AnimatePresence>
      {open && promptA && promptB && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          tabIndex={-1}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <motion.div
            className="bg-bg-1 border border-accent/8 shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col rounded-[var(--radius-xl)]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-accent/8">
              <div className="flex items-center gap-2">
                <Columns2 className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-text-1 uppercase tracking-wide">Compare Prompts</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close diff modal"
                className="p-1.5 hover:bg-glass text-text-3 hover:text-text-1 transition-colors rounded-[var(--radius-md)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-accent/8 text-xs text-text-2">
              <span>
                A: <strong className="text-text-1">{stats.wordsA}</strong> words
              </span>
              <span>
                B: <strong className="text-text-1">{stats.wordsB}</strong> words
              </span>
              <span>
                Shared: <strong className="text-text-1">{stats.shared}</strong>
              </span>
            </div>

            {/* Side-by-side headers */}
            <div className="grid grid-cols-2 gap-4 px-5 pt-4 pb-2">
              <div>
                <p className="text-xs font-medium text-text-2 truncate">
                  A: {promptA.title}
                </p>
                <p className="text-[10px] text-text-2">
                  {new Date(promptA.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-2 truncate">
                  B: {promptB.title}
                </p>
                <p className="text-[10px] text-text-2">
                  {new Date(promptB.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Diff view */}
            <div className="flex-1 overflow-auto px-5 pb-5">
              <div className="bg-bg-input p-4 border border-accent/8 rounded-[var(--radius-md)]">
                <p className="text-sm font-mono leading-relaxed">
                  {diff.map((word, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "inline",
                        word.type === "only-a" && "bg-red-500/20 text-red-400 line-through",
                        word.type === "only-b" && "bg-emerald-500/20 text-emerald-400",
                        word.type === "shared" && "text-text-2",
                      )}
                    >
                      {word.text}{" "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
