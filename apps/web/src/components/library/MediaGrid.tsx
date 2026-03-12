"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Download,
  Copy,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import type { GeneratedImage } from "@/lib/services/generate-service";

interface MediaGridProps {
  images: GeneratedImage[];
  onDelete?: (id: string) => void;
  onStar?: (id: string) => void;
}

export function MediaGrid({ images, onDelete, onStar }: MediaGridProps) {
  const addToast = useUIStore((s) => s.addToast);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null,
  );

  const handleCopyPrompt = async (img: GeneratedImage) => {
    await navigator.clipboard.writeText(img.prompt);
    addToast({ message: "Prompt copied!", type: "success" });
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `generated-${img.id.slice(0, 8)}.svg`;
    a.click();
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="w-12 h-12 text-text-3/30 mb-3" />
        <p className="text-sm text-text-2">No generated images yet</p>
        <p className="text-xs text-text-2 mt-1">
          Use the builder to create prompts and generate images.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <motion.div
            key={img.id}
            layout
            className="group relative rounded-xl overflow-hidden border border-border bg-bg-2 cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.prompt.slice(0, 60)}
              className="w-full aspect-square object-contain bg-bg-3"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
              <p className="text-[10px] text-white/80 line-clamp-2 mb-1">
                {img.prompt.slice(0, 80)}…
              </p>
              <div className="flex items-center gap-1 text-[9px] text-white/50">
                <span>{img.modelId}</span>
                <span>·</span>
                <span>{new Date(img.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            />
            <motion.div
              className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl border border-border bg-bg-1 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text-1">
                  Image Detail
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded-lg hover:bg-surface transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-text-3" />
                </button>
              </div>

              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt.slice(0, 60)}
                className="w-full max-h-[50vh] object-contain bg-bg-3"
              />

              {/* Metadata */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-text-2 uppercase tracking-wider font-medium mb-1">
                    Prompt
                  </p>
                  <p className="text-xs text-text-1 leading-relaxed">
                    {selectedImage.prompt}
                  </p>
                </div>
                <div className="flex gap-4 text-xs text-text-2">
                  <span>Model: {selectedImage.modelId}</span>
                  <span>Ratio: {selectedImage.aspectRatio}</span>
                  <span>
                    {new Date(selectedImage.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleCopyPrompt(selectedImage)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "bg-surface border border-border hover:bg-bg-3 transition-colors text-text-2",
                    )}
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Prompt
                  </button>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "bg-surface border border-border hover:bg-bg-3 transition-colors text-text-2",
                    )}
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  {onStar && (
                    <button
                      onClick={() => onStar(selectedImage.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                        "bg-surface border border-border hover:bg-bg-3 transition-colors text-text-2",
                      )}
                    >
                      <Star className="w-3.5 h-3.5" /> Star
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(selectedImage.id);
                        setSelectedImage(null);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                        "bg-surface border border-red-500/30 hover:bg-red-500/10 transition-colors text-red-400",
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
