"use client";

import { useState, useRef } from "react";
import { ImageIcon, Link, X, Upload } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore, useUIStore } from "@/lib/store";
import type { UIStore } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ReferenceImage() {
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

    // Reset file input
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
    <div className="border border-accent/8 bg-bg-2 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-accent" aria-hidden="true" />
        <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-[0.15em]">Reference Image</h3>
      </div>

      {referenceImageUrl ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={referenceImageUrl}
            alt="Reference"
            className="w-full max-h-48 object-cover border border-accent/8"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove reference image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* URL input */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 flex-1 border border-accent/8 bg-bg-1 px-3 py-1.5">
              <Link className="w-3.5 h-3.5 text-text-3 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUrlSubmit();
                }}
                placeholder="Paste image URL…"
                className="flex-1 bg-transparent text-sm font-mono text-text-1 placeholder:text-text-3 outline-none"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className={clsx(
                "px-3 py-1.5 text-xs font-mono font-medium transition-colors",
                urlInput.trim()
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-surface text-text-3 cursor-not-allowed",
              )}
            >
              Set
            </button>
          </div>

          {/* File upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-accent/8 hover:border-accent/50 hover:bg-accent/5 transition-colors text-text-2 hover:text-accent"
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
