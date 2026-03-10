"use client";

import { useEffect } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

export function UndoRedo() {
  const undoCount = useBuilderStore((s) => s.undoStack.length);
  const redoCount = useBuilderStore((s) => s.redoStack.length);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={undo}
        disabled={undoCount === 0}
        title="Undo (Ctrl+Z)"
        className={clsx(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
          undoCount > 0
            ? "bg-surface text-text-2 hover:bg-bg-3 hover:text-text-1"
            : "text-text-3/40 cursor-not-allowed",
        )}
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={redoCount === 0}
        title="Redo (Ctrl+Shift+Z)"
        className={clsx(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150",
          redoCount > 0
            ? "bg-surface text-text-2 hover:bg-bg-3 hover:text-text-1"
            : "text-text-3/40 cursor-not-allowed",
        )}
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
