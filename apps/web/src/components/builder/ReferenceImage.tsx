"use client";

import { useState, useRef } from "react";
import { ImageIcon, Link, X, Upload, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import type { UIStore } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function MoodInput() {
  const mood = useBuilderStore((s) => s.mood);
  const setMood = useBuilderStore((s) => s.setMood);

  return (
    <div className="border border-glass-border bg-bg-2 p-4 space-y-3 rounded-[var(--radius-lg)]">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent2" aria-hidden="true" />
        <p className="label-section">Mood / Visual Direction</p>
      </div>
      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Describe the vibe, atmosphere, or feeling you want… e.g. &quot;cinematic golden hour, moody editorial, high fashion minimalist&quot;"
        rows={3}
        className="w-full bg-bg-input border border-glass-border text-sm text-text-1 placeholder:text-text-3 rounded-[var(--radius-md)] px-3 py-2.5 resize-none outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent transition-colors duration-150"
      />
      <p className="text-[10px] text-text-3">
        This text is appended to your prompt to guide the overall aesthetic.
      </p>
    </div>
  );
}

export function ReferenceImageUpload() {
  const referenceImageUrl = useBuilderStore((s) => s.referenceImageUrl);
  const setReferenceImageUrl = useBuilderStore((s) => s.setReferenceImageUrl);
  const addToast = useUIStore((s: UIStore) => s.addToast);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      addToast({ message: "File too large (max 10MB)", type: "error" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      addToast({ message: "Only image files are supported", type: "error" });
      return;
    }

    // BACKEND: Needs real upload — currently stores as object URL
    const objectUrl = URL.createObjectURL(file);
    setReferenceImageUrl(objectUrl);
    addToast({ message: "Reference image added", type: "success" });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleUrlSubmit() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      addToast({ message: "Invalid URL", type: "error" });
      return;
    }

    setReferenceImageUrl(trimmed);
    setUrlInput("");
    addToast({ message: "Reference image URL set", type: "success" });
  }

  function handleClear() {
    if (referenceImageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(referenceImageUrl);
    }
    setReferenceImageUrl(null);
  }

  return (
    <div className="border border-glass-border bg-bg-2 p-4 space-y-3 rounded-[var(--radius-lg)]">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="label-section">Reference Image</p>
      </div>

      {referenceImageUrl ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={referenceImageUrl}
            alt="Reference"
            className="w-full max-h-48 object-cover border border-glass-border rounded-[var(--radius-md)]"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Remove reference image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* URL input */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 flex-1 border border-glass-border bg-bg-input px-3 py-1.5 rounded-[var(--radius-md)]">
              <Link className="w-3.5 h-3.5 text-text-3 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUrlSubmit();
                }}
                placeholder="Paste image URL…"
                className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium transition-colors rounded-[var(--radius-md)] cursor-pointer",
                urlInput.trim()
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : "bg-glass text-text-3 cursor-not-allowed",
              )}
            >
              Set
            </button>
          </div>

          {/* File upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-glass-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-text-2 hover:text-accent rounded-[var(--radius-md)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span className="text-xs font-medium">Upload image (max 10MB)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload reference image"
          />
        </div>
      )}

      {referenceImageUrl && (
        <p className="text-[10px] text-text-3">
          Midjourney: injected as --sref · Others: style reference text
        </p>
      )}
    </div>
  );
}

export function ReferenceImage() {
  return (
    <div className="space-y-4">
      <MoodInput />
      <ReferenceImageUpload />
    </div>
  );
}
