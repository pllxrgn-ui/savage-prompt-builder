"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  X,
  Upload,
  ArrowRight,
  Edit2,
  Check,
  Wand2,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMoodboardStore } from "@/lib/store/moodboard-store";
import { uploadMedia } from "@/lib/services/media-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasonryShowcase } from "@/components/ui/MasonryShowcase";
import type { Moodboard } from "@/lib/store/moodboard-store";

const MOOD_PRESETS = [
  "Cinematic golden hour",
  "Moody editorial",
  "High fashion minimalist",
  "Street style gritty",
  "Dreamy pastel",
  "Bold retro pop",
  "Clean studio",
  "Dark luxury",
] as const;

// ─── Splash: shown when no boards exist ──────────────────────────────────────

function MoodboardSplash({ onCreateBoard }: { onCreateBoard: (mood?: string) => void }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <MasonryShowcase />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent2/15 mb-6">
            <Sparkles className="w-7 h-7 text-accent2" />
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-1 mb-3">
            Create Your Moodboard
          </h1>
          <p className="text-sm text-text-2 leading-relaxed mb-8 max-w-sm">
            Pin images, set the mood, and build visual direction for your prompts.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {MOOD_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => onCreateBoard(preset)}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-text-3 border border-glass-border hover:border-accent/30 hover:text-accent hover:bg-accent/5 transition-colors duration-150 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <Button
            onClick={() => onCreateBoard()}
            className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-8 py-2.5 transition-colors duration-150 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Board tab ────────────────────────────────────────────────────────────────

function BoardTab({
  board,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: {
  board: Moodboard;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(board.name);

  function commitRename() {
    if (name.trim()) onRename(name.trim());
    else setName(board.name);
    setEditing(false);
  }

  return (
    <div className="flex items-center group flex-shrink-0">
      {editing ? (
        <div className="flex items-center gap-1 px-3 py-3">
          <input
            autoFocus
            value={name}
            aria-label="Board name"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") { setName(board.name); setEditing(false); }
            }}
            onBlur={commitRename}
            className="w-28 text-sm bg-bg-input border border-accent/40 rounded-md px-2 py-0.5 text-text-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
          />
          <button onClick={commitRename} aria-label="Save name" className="text-accent cursor-pointer">
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center gap-1 px-4 border-b-2 transition-colors duration-150",
            isActive
              ? "border-accent text-accent"
              : "border-transparent text-text-3 hover:text-text-1 hover:border-border-strong",
          )}
        >
          <button
            onClick={onSelect}
            className="flex items-center gap-2 py-3.5 text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            {board.name}
            {board.images.length > 0 && (
              <span className="text-[10px] bg-bg-3 text-text-3 rounded-full px-1.5 py-0.5 tabular-nums">
                {board.images.length}
              </span>
            )}
          </button>
          {/* Inline controls — fade in on hover, no overlap */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              aria-label="Rename board"
              className="p-1 text-text-3 hover:text-text-1 cursor-pointer transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              aria-label="Delete board"
              className="p-1 text-text-3 hover:text-red-500 cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pin grid ─────────────────────────────────────────────────────────────────

function PinGrid({
  board,
  onRemoveImage,
  onUpload,
  uploading,
  showUrlInput,
  onToggleUrlInput,
}: {
  board: Moodboard;
  onRemoveImage: (imageId: string) => void;
  onUpload: () => void;
  uploading: boolean;
  showUrlInput: boolean;
  onToggleUrlInput: () => void;
}) {
  const hasImages = board.images.length > 0;

  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        hasImages
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          : "grid-cols-1",
      )}
    >
      <AnimatePresence>
        {board.images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-bg-2 border border-glass-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            <button
              onClick={() => onRemoveImage(img.id)}
              aria-label="Remove image"
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500/80"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Upload tile */}
      {!hasImages ? (
        <div className="col-span-full flex flex-col items-center gap-3 py-8">
          <button
            onClick={onUpload}
            disabled={uploading}
            aria-label="Add image"
            className={cn(
              "w-64 py-12 rounded-[var(--radius-lg)] border-2 border-dashed border-glass-border hover:border-accent/40 hover:bg-accent/5 flex flex-col items-center justify-center gap-3 transition-all duration-150 cursor-pointer",
              uploading && "opacity-50 cursor-not-allowed",
            )}
          >
            <Upload className="w-8 h-8 text-text-3" />
            <span className="text-sm text-text-3">
              {uploading ? "Uploading…" : "Upload reference images"}
            </span>
          </button>
          {!showUrlInput && (
            <button
              onClick={onToggleUrlInput}
              className="flex items-center gap-1.5 text-xs text-text-3 hover:text-accent transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              Paste image URL
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onUpload}
          disabled={uploading}
          aria-label="Add image"
          className={cn(
            "aspect-square rounded-[var(--radius-md)] border-2 border-dashed border-glass-border hover:border-accent/40 hover:bg-accent/5 flex flex-col items-center justify-center gap-2 transition-all duration-150 cursor-pointer",
            uploading && "opacity-50 cursor-not-allowed",
          )}
        >
          <Upload className="w-5 h-5 text-text-3" />
          <span className="text-xs text-text-3">
            {uploading ? "Uploading…" : "Add image"}
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MoodboardPage() {
  const router = useRouter();

  const boards = useMoodboardStore((s) => s.boards);
  const activeBoardId = useMoodboardStore((s) => s.activeBoardId);
  const createBoard = useMoodboardStore((s) => s.createBoard);
  const deleteBoard = useMoodboardStore((s) => s.deleteBoard);
  const renameBoard = useMoodboardStore((s) => s.renameBoard);
  const setActiveBoardId = useMoodboardStore((s) => s.setActiveBoardId);
  const setBoardMood = useMoodboardStore((s) => s.setBoardMood);
  const addImage = useMoodboardStore((s) => s.addImage);
  const removeImage = useMoodboardStore((s) => s.removeImage);
  const applyToBuilder = useMoodboardStore((s) => s.applyToBuilder);

  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;

  function handleCreateBoard(mood?: string) {
    const id = createBoard();
    if (mood) {
      useMoodboardStore.getState().setBoardMood(id, mood);
    }
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || !activeBoardId) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const { url } = await uploadMedia(file);
        addImage(activeBoardId, { url, alt: file.name, source: "upload" });
      }
    } finally {
      setUploading(false);
    }
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed || !activeBoardId) return;
    addImage(activeBoardId, { url: trimmed, alt: "Reference image", source: "url" });
    setUrlInput("");
    setShowUrlInput(false);
  }

  function handleApply() {
    if (!activeBoardId) return;
    applyToBuilder(activeBoardId);
    router.push("/builder");
  }

  // No boards → splash
  if (boards.length === 0) {
    return <MoodboardSplash onCreateBoard={handleCreateBoard} />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* ── Board tabs ─────────────────────────────────────────── */}
      <div className="border-b border-glass-border bg-bg-1 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center overflow-x-auto scrollbar-none">
          {boards.map((board) => (
            <BoardTab
              key={board.id}
              board={board}
              isActive={activeBoardId === board.id}
              onSelect={() => setActiveBoardId(board.id)}
              onDelete={() => deleteBoard(board.id)}
              onRename={(name) => renameBoard(board.id, name)}
            />
          ))}
          <button
            onClick={() => handleCreateBoard()}
            aria-label="New board"
            className="flex items-center gap-1.5 px-3 py-4 text-sm text-text-3 hover:text-text-1 transition-colors duration-150 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Board</span>
          </button>
        </div>
      </div>

      {/* ── Board content ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeBoard && (
          <motion.div
            key={activeBoard.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Pin grid area */}
            <div className={cn(
              "flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full",
              activeBoard.images.length === 0 && "flex flex-col items-center justify-center"
            )}>
              <div className="w-full">
              <PinGrid
                board={activeBoard}
                onRemoveImage={(imageId) => removeImage(activeBoard.id, imageId)}
                onUpload={() => fileInputRef.current?.click()}
                uploading={uploading}
                showUrlInput={showUrlInput}
                onToggleUrlInput={() => setShowUrlInput(true)}
              />

              {/* URL input — shown below pin grid (all states) */}
              <div className={cn("mt-4", activeBoard.images.length === 0 && "flex justify-center")}>
                {showUrlInput ? (
                  <div className="flex gap-2 max-w-sm">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                      className="bg-bg-input border-glass-border text-text-1 placeholder:text-text-3 text-xs focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddUrl}
                      className="bg-accent hover:bg-accent-hover text-white cursor-pointer"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowUrlInput(false)}
                      className="text-text-3 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  /* Only show standalone URL toggle when images are present (empty state handled in PinGrid) */
                  activeBoard.images.length > 0 && (
                    <button
                      onClick={() => setShowUrlInput(true)}
                      className="flex items-center gap-1.5 text-xs text-text-3 hover:text-accent transition-colors cursor-pointer"
                    >
                      <LinkIcon className="w-3 h-3" />
                      Paste image URL
                    </button>
                  )
                )}
              </div>
              </div>
            </div>

            {/* ── Bottom bar: mood + CTA ──────────────────────── */}
            <div className="border-t border-glass-border bg-bg-1 px-4 md:px-8 py-5">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-end gap-5">
                {/* Mood section */}
                <div className="flex-1 space-y-2 min-w-0">
                  <p className="label-section">Mood Direction</p>
                  <div className="flex flex-wrap gap-1.5">
                    {MOOD_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() =>
                          setBoardMood(
                            activeBoard.id,
                            activeBoard.mood === preset ? "" : preset,
                          )
                        }
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer",
                          activeBoard.mood === preset
                            ? "bg-accent/15 text-accent border border-accent/20"
                            : "text-text-3 border border-glass-border hover:border-accent/30 hover:text-text-1 hover:bg-glass",
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Describe the mood, style, vibe…"
                    aria-label="Mood description"
                    value={activeBoard.mood}
                    onChange={(e) => setBoardMood(activeBoard.id, e.target.value)}
                    className="w-full max-w-lg bg-bg-input border border-glass-border rounded-[var(--radius-md)] px-3 py-2 text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent"
                  />
                </div>

                {/* Apply CTA */}
                <Button
                  onClick={handleApply}
                  disabled={!activeBoard.mood && activeBoard.images.length === 0}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-full px-6 transition-colors duration-150 cursor-pointer shrink-0"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Apply to Builder
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        aria-label="Upload images"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
    </div>
  );
}
