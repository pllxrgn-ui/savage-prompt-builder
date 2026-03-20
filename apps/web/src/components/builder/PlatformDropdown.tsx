"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { clsx } from "clsx";
import { useBuilderStore } from "@/lib/store";

interface PlatformOption {
  label: string;
  ratio: string;
  dimensions: string;
}

const SOCIAL_PLATFORMS: PlatformOption[] = [
  // Instagram
  { label: "Instagram Feed (Square)", ratio: "1:1", dimensions: "1080×1080" },
  { label: "Instagram Feed (Portrait)", ratio: "4:5", dimensions: "1080×1350" },
  { label: "Instagram Feed (Landscape)", ratio: "1.91:1", dimensions: "1080×566" },
  { label: "Instagram Story", ratio: "9:16", dimensions: "1080×1920" },
  { label: "Instagram Reel", ratio: "9:16", dimensions: "1080×1920" },
  { label: "Instagram Carousel", ratio: "1:1", dimensions: "1080×1080" },
  // TikTok
  { label: "TikTok Video", ratio: "9:16", dimensions: "1080×1920" },
  { label: "TikTok Photo Post", ratio: "9:16", dimensions: "1080×1920" },
  // YouTube
  { label: "YouTube Thumbnail", ratio: "16:9", dimensions: "1280×720" },
  { label: "YouTube Shorts", ratio: "9:16", dimensions: "1080×1920" },
  { label: "YouTube Banner", ratio: "16:9", dimensions: "2560×1440" },
  { label: "YouTube Community Post", ratio: "1:1", dimensions: "1080×1080" },
  // Facebook
  { label: "Facebook Post", ratio: "1.91:1", dimensions: "1200×630" },
  { label: "Facebook Story", ratio: "9:16", dimensions: "1080×1920" },
  { label: "Facebook Cover", ratio: "2.7:1", dimensions: "820×312" },
  { label: "Facebook Event Cover", ratio: "16:9", dimensions: "1920×1080" },
  { label: "Facebook Ad (Square)", ratio: "1:1", dimensions: "1080×1080" },
  // Twitter / X
  { label: "X (Twitter) Post", ratio: "16:9", dimensions: "1200×675" },
  { label: "X (Twitter) Header", ratio: "3:1", dimensions: "1500×500" },
  // LinkedIn
  { label: "LinkedIn Post", ratio: "1.91:1", dimensions: "1200×627" },
  { label: "LinkedIn Story", ratio: "9:16", dimensions: "1080×1920" },
  { label: "LinkedIn Banner", ratio: "4:1", dimensions: "1584×396" },
  { label: "LinkedIn Article Cover", ratio: "1.91:1", dimensions: "1200×644" },
  // Pinterest
  { label: "Pinterest Pin", ratio: "2:3", dimensions: "1000×1500" },
  { label: "Pinterest Story Pin", ratio: "9:16", dimensions: "1080×1920" },
  { label: "Pinterest Square Pin", ratio: "1:1", dimensions: "1000×1000" },
  // Snapchat
  { label: "Snapchat Snap", ratio: "9:16", dimensions: "1080×1920" },
  { label: "Snapchat Story Ad", ratio: "9:16", dimensions: "1080×1920" },
  // Threads
  { label: "Threads Post", ratio: "1:1", dimensions: "1080×1080" },
  // Discord
  { label: "Discord Server Icon", ratio: "1:1", dimensions: "512×512" },
  { label: "Discord Banner", ratio: "16:9", dimensions: "960×540" },
  // Twitch
  { label: "Twitch Panel", ratio: "3.2:1", dimensions: "320×100" },
  { label: "Twitch Offline Banner", ratio: "16:9", dimensions: "1920×1080" },
  // WhatsApp
  { label: "WhatsApp Status", ratio: "9:16", dimensions: "1080×1920" },
  // Spotify
  { label: "Spotify Playlist Cover", ratio: "1:1", dimensions: "640×640" },
  // Etsy
  { label: "Etsy Listing Photo", ratio: "4:3", dimensions: "2700×2025" },
  { label: "Etsy Shop Banner", ratio: "3.36:1", dimensions: "1200×300" },
  // General
  { label: "Custom / Freeform", ratio: "", dimensions: "" },
];

export function PlatformDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const value = useBuilderStore((s) => s.templateFields["subject"] ?? "");
  const setField = useBuilderStore((s) => s.setField);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = SOCIAL_PLATFORMS.find((p) => p.label === value) ?? null;

  const filtered = useMemo(() => {
    if (!search) return SOCIAL_PLATFORMS;
    const q = search.toLowerCase();
    return SOCIAL_PLATFORMS.filter((p) => p.label.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleSelect(platform: PlatformOption) {
    setField("subject", platform.label);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-[10px] font-medium text-text-3 uppercase tracking-wider">
        PLATFORM / POST TYPE
        <span className="text-accent">*</span>
      </label>

      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={clsx(
            "w-full flex items-center justify-between px-3 py-2.5 text-sm text-left",
            "bg-bg-input border border-accent/8 rounded-[var(--radius-md)]",
            "focus-visible:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20",
            "transition-all duration-150",
          )}
        >
          {selected ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-text-1 truncate">{selected.label}</span>
              {selected.ratio && (
                <span className="shrink-0 px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-medium rounded-full">
                  {selected.ratio}
                </span>
              )}
            </div>
          ) : (
            <span className="text-text-3">Select platform...</span>
          )}
          <ChevronDown className={clsx("w-4 h-4 text-text-3 shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-bg-1 border border-accent/8 shadow-lg overflow-hidden rounded-[var(--radius-lg)]">
            {/* Search */}
            <div className="p-2 border-b border-accent/8">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search platforms..."
                  className={clsx(
                    "w-full pl-8 pr-8 py-2 text-xs",
                    "bg-bg-input border border-accent/8 rounded-[var(--radius-md)]",
                    "text-text-1 placeholder:text-text-3",
                    "focus-visible:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/20",
                  )}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5 text-text-3 hover:text-text-1" />
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <p className="text-xs text-text-3 text-center py-4">No platforms match.</p>
              )}
              {filtered.map((platform) => {
                const isActive = value === platform.label;
                return (
                  <button
                    key={platform.label}
                    onClick={() => handleSelect(platform)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2 text-left text-xs",
                      "hover:bg-surface transition-colors",
                      isActive && "bg-accent/10",
                    )}
                  >
                    <span className={clsx("font-medium", isActive ? "text-accent" : "text-text-1")}>
                      {platform.label}
                    </span>
                    {platform.ratio && (
                      <span className="text-[10px] text-text-3">
                        {platform.ratio} · {platform.dimensions}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Show selected dimensions */}
      {selected && selected.dimensions && (
        <p className="text-[10px] text-text-3">
          Aspect ratio: {selected.ratio} · {selected.dimensions}px
        </p>
      )}
    </div>
  );
}
