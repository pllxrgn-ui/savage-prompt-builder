"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image as ImageIcon,
  RotateCcw,
  Download,
  Copy,
  Bookmark,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";
import { IMAGE_GEN_MODELS } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/lib/store";
import { ProUpgradeCard } from "@/components/ui/ProUpgradeCard";
import {
  generateImages,
  type GeneratedImage,
  type GenerateJob,
} from "@/lib/services/generate-service";

const ASPECT_RATIOS = ["1:1", "4:5", "16:9", "9:16", "3:2", "2:3"] as const;
const IMAGE_COUNTS = [1, 2, 3, 4] as const;

interface GenerateModalProps {
  open: boolean;
  onClose: () => void;
  initialPrompt: string;
}

export function GenerateModal({
  open,
  onClose,
  initialPrompt,
}: GenerateModalProps) {
  const { isPro } = useAuth();
  const addToast = useUIStore((s) => s.addToast);

  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState(IMAGE_GEN_MODELS[0]!.id);
  const [count, setCount] = useState<number>(1);
  const [ratio, setRatio] = useState<string>("1:1");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [job, setJob] = useState<GenerateJob | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedModel = IMAGE_GEN_MODELS.find((m) => m.id === modelId);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setJob(null);
    try {
      const result = await generateImages({
        prompt: prompt.trim(),
        modelId,
        count,
        aspectRatio: ratio,
      });
      setJob(result);
    } catch {
      addToast({ message: "Generation failed. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [prompt, modelId, count, ratio, loading, addToast]);

  const handleCopyUrl = async (img: GeneratedImage) => {
    await navigator.clipboard.writeText(img.url);
    addToast({ message: "Image URL copied!", type: "success" });
  };

  const handleDownload = (img: GeneratedImage, index: number) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `generated-${index + 1}.svg`;
    a.click();
  };

  // Reset prompt to initial
  const handleReset = () => setPrompt(initialPrompt);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl border border-border bg-bg-1 shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-heading font-bold text-text-1">
                  Generate Image
                </h2>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/15 text-accent">
                  Pro
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-3" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {!isPro ? (
                <ProUpgradeCard
                  feature="Image Generation"
                  description="Generate images directly from your prompts with 8 supported models."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left column — Controls */}
                  <div className="space-y-4">
                    {/* Prompt textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-text-2">
                          Prompt
                        </label>
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-1 text-[10px] text-text-2 hover:text-accent transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2.5 rounded-lg bg-bg-input border border-border text-sm text-text-1 placeholder:text-text-2 focus:outline-none focus:border-accent/50 resize-none"
                        placeholder="Your prompt…"
                      />
                    </div>

                    {/* Model selector */}
                    <div className="relative">
                      <label className="text-xs font-medium text-text-2 mb-1.5 block">
                        Model
                      </label>
                      <button
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-bg-input border border-border text-sm text-text-1 hover:bg-bg-3 transition-colors"
                      >
                        <span>{selectedModel?.name ?? "Select model"}</span>
                        <ChevronDown className="w-4 h-4 text-text-3" />
                      </button>
                      {showModelDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-bg-1 border border-border rounded-xl shadow-lg py-1 max-h-48 overflow-y-auto">
                          {IMAGE_GEN_MODELS.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setModelId(m.id);
                                setShowModelDropdown(false);
                              }}
                              className={clsx(
                                "w-full text-left px-3 py-2 text-sm hover:bg-surface transition-colors",
                                modelId === m.id
                                  ? "text-accent bg-accent/5"
                                  : "text-text-1",
                              )}
                            >
                              {m.name}
                              <span className="ml-2 text-[10px] text-text-2">
                                {m.provider}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image count */}
                    <div>
                      <label className="text-xs font-medium text-text-2 mb-1.5 block">
                        Image Count
                      </label>
                      <div className="flex gap-2">
                        {IMAGE_COUNTS.map((n) => (
                          <button
                            key={n}
                            onClick={() => setCount(n)}
                            className={clsx(
                              "flex-1 py-2 rounded-lg text-sm font-medium transition-all border",
                              count === n
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-surface text-text-3 border-transparent hover:text-text-2",
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Aspect ratio */}
                    <div>
                      <label className="text-xs font-medium text-text-2 mb-1.5 block">
                        Aspect Ratio
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ASPECT_RATIOS.map((r) => (
                          <button
                            key={r}
                            onClick={() => setRatio(r)}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                              ratio === r
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-surface text-text-3 border-transparent hover:text-text-2",
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Generating…
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4" /> Generate
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right column — Results */}
                  <div className="min-h-[300px] flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-2/50">
                    {loading && (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                        <p className="text-sm text-text-2">
                          Generating images…
                        </p>
                        {/* Progress bar stub */}
                        <div className="w-48 h-1.5 rounded-full bg-bg-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-accent rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {!loading && !job && (
                      <div className="text-center p-6">
                        <ImageIcon className="w-10 h-10 text-text-3/40 mx-auto mb-3" />
                        <p className="text-sm text-text-2">
                          Generated images will appear here
                        </p>
                      </div>
                    )}

                    {!loading && job?.status === "complete" && (
                      <div className="w-full p-4 grid grid-cols-2 gap-3">
                        {job.images.map((img, i) => (
                          <div
                            key={img.id}
                            className="group relative rounded-lg overflow-hidden border border-border bg-bg-3"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={`Generated ${i + 1}`}
                              className="w-full aspect-square object-contain"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDownload(img, i)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Download"
                              >
                                <Download className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() => handleCopyUrl(img)}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Copy URL"
                              >
                                <Copy className="w-4 h-4 text-white" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                aria-label="Save to Gallery"
                              >
                                <Bookmark className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
