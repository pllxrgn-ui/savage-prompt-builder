"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  Copy,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
  ImageIcon,
  Zap,
  WandSparkles,
  Check,
  Palette,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IMAGE_GEN_MODELS } from "@/lib/data";
import { generateImages, type GeneratedImage } from "@/lib/services/generate-service";
import { saveMedia } from "@/lib/services/media-service";
import { useUIStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ValidationGate } from "@/components/generate/ValidationGate";

/* ── Constants ── */
const GOOGLE_MODELS = IMAGE_GEN_MODELS.filter((m) => m.provider === "google");

const ASPECT_RATIOS = [
  { id: "1:1",  label: "1:1",  w: 1,  h: 1,  hint: "Square",   tileClass: "w-7 h-7"       },
  { id: "4:3",  label: "4:3",  w: 4,  h: 3,  hint: "Standard", tileClass: "w-7 h-[21px]"  },
  { id: "3:4",  label: "3:4",  w: 3,  h: 4,  hint: "Portrait", tileClass: "w-[21px] h-7"  },
  { id: "16:9", label: "16:9", w: 16, h: 9,  hint: "Wide",     tileClass: "w-7 h-4"       },
  { id: "9:16", label: "9:16", w: 9,  h: 16, hint: "Story",    tileClass: "w-4 h-7"       },
] as const;

const COUNT_OPTIONS = [1, 2, 3, 4] as const;

const RATIO_CLASS: Record<string, string> = {
  "1:1":  "aspect-square",
  "4:3":  "aspect-[4/3]",
  "3:4":  "aspect-[3/4]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

/* ── Sub-components ── */

function AspectRatioTile({
  ratio,
  selected,
  onClick,
}: {
  ratio: (typeof ASPECT_RATIOS)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2 rounded-[var(--radius-md)] border transition-all duration-150 text-center cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        selected
          ? "bg-accent/10 border-accent/50 text-text-1"
          : "bg-transparent border-glass-border text-text-2 hover:border-glass-border-strong hover:text-text-1",
      )}
    >
      <div
        className={cn(
          "rounded-sm border-2 transition-colors",
          ratio.tileClass,
          selected ? "border-accent bg-accent/20" : "border-text-3/40 bg-text-3/5",
        )}
      />
      <span className="text-[11px] font-medium leading-tight">{ratio.label}</span>
      <span className="text-[9px] text-text-3 leading-tight">{ratio.hint}</span>
    </button>
  );
}

function ImageResultCard({
  image,
  index,
  ratio,
  onDownload,
  onCopy,
}: {
  image: GeneratedImage;
  index: number;
  ratio: string;
  onDownload: () => void;
  onCopy: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const ratioClass = RATIO_CLASS[ratio] ?? "aspect-square";

  async function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden border border-glass-border group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("relative w-full", ratioClass)}>
        <Image
          src={image.url}
          alt={`Generated image ${index + 1}`}
          fill
          className="object-cover"
          unoptimized // base64 data URIs
        />
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 gap-2"
          >
            <p className="text-[11px] text-white/70 line-clamp-2">
              {image.prompt.slice(0, 80)}{image.prompt.length > 80 ? "…" : ""}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer
                  bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors backdrop-blur-sm"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy prompt"}
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer
                  bg-accent text-white hover:bg-accent-hover border border-accent/30 transition-colors"
              >
                <Download className="w-3 h-3" />
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkeletonGrid({ count, ratio }: { count: number; ratio: string }) {
  const ratioClass = RATIO_CLASS[ratio] ?? "aspect-square";
  return (
    <div
      className={cn(
        "grid gap-4",
        count === 1 ? "grid-cols-1 max-w-lg mx-auto" : "grid-cols-2",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-glass-border relative">
          <div className={cn("w-full relative bg-bg-2", ratioClass)}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                <Sparkles className="w-8 h-8 text-accent/40" />
              </motion.div>
              <p className="text-xs text-text-3">Generating image {i + 1}…</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component (inner, reads searchParams) ── */
function GeneratePageInner() {
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);
  const { credits, deductCredits } = useAuth();

  const initialPrompt = searchParams.get("prompt") ?? "";

  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState(
    GOOGLE_MODELS.find((m) => m.name === "Nanobanana 2")?.id ?? GOOGLE_MODELS[0]?.id ?? "gemini-3.1-flash-image-preview"
  );
  const [ratio, setRatio] = useState<string>("1:1");
  const [count, setCount] = useState<number>(1);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showNegative, setShowNegative] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState(0);

  const selectedModel = GOOGLE_MODELS.find((m) => m.id === modelId) ?? GOOGLE_MODELS[0];

  // Pre-fill from URL and auto-generate
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    const cost = count; // 1 credit per image
    if (!deductCredits(cost)) {
      addToast({ message: "Not enough credits — upgrade or wait for refresh", type: "error" });
      return;
    }

    setCreditsUsed(cost);
    setLoading(true);
    setImages([]);
    setHasGenerated(true);
    setShowValidation(false);
    try {
      const job = await generateImages({
        prompt: prompt.trim(),
        modelId,
        count,
        aspectRatio: ratio,
        negativePrompt: negativePrompt.trim() || undefined,
      });
      setImages(job.images);
      saveMedia(job.images);
      setShowValidation(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      addToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [prompt, modelId, count, ratio, negativePrompt, loading, addToast, deductCredits]);

  function handleDownload(image: GeneratedImage, index: number) {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = `savage-${Date.now()}-${index + 1}.png`;
    a.click();
  }

  async function handleCopyPrompt(image: GeneratedImage) {
    await navigator.clipboard.writeText(image.prompt);
    addToast({ message: "Prompt copied!", type: "success" });
  }

  const canGenerate = prompt.trim().length > 0 && !loading;
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const shortcutLabel = isMac ? "⌘ Enter" : "Ctrl Enter";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-6 md:py-10 pb-20 md:pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20">
          <ImageIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-text-1">Manual</h1>
          <p className="text-text-2 text-sm">
            Turn your prompt into stunning images — powered by Imagen 4 &amp; Nanobanana 2.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 items-start">

        {/* ── Left: Controls ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-[var(--radius-lg)] bg-bg-2 border border-glass-border p-6 space-y-5 lg:sticky lg:top-20"
        >
          {/* Prompt */}
          <div>
            <p className="label-section mb-2.5">Prompt</p>
            <div className="rounded-[var(--radius-md)] bg-bg-input border border-glass-border overflow-hidden
              focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
                }}
                placeholder="Describe the image you want to create…"
                rows={4}
                aria-label="Image generation prompt"
                className="w-full bg-transparent text-text-1 placeholder:text-text-3 text-sm p-4 resize-none focus-visible:outline-none"
              />
              <div className="flex items-center justify-between px-4 pb-2.5">
                <span className="text-[10px] text-text-3">{prompt.length}/2000</span>
                <kbd className="hidden sm:block text-[10px] text-text-3 border border-glass-border rounded px-1.5 py-0.5">
                  {shortcutLabel}
                </kbd>
              </div>
            </div>
          </div>

          {/* Model selector */}
          <div>
            <p className="label-section mb-2.5">Model</p>
            <div className="relative">
              <button
                onClick={() => setModelOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-[var(--radius-md)] cursor-pointer
                  bg-bg-input border border-glass-border hover:border-glass-border-strong text-sm text-text-1 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <div className="flex items-center gap-2">
                  <WandSparkles className="w-3.5 h-3.5 text-accent2" />
                  <span>{selectedModel?.name}</span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-text-3 transition-transform", modelOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {modelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 right-0 z-20 rounded-[var(--radius-md)] bg-bg-2 border border-glass-border shadow-xl overflow-hidden"
                  >
                    {GOOGLE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setModelId(m.id); setModelOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer",
                          modelId === m.id
                            ? "bg-accent/10 text-accent"
                            : "text-text-2 hover:bg-glass hover:text-text-1",
                        )}
                      >
                        <WandSparkles className="w-3.5 h-3.5 shrink-0" />
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-[10px] text-text-3">
                            {m.id.includes("fast") ? "Faster • Lower latency" : m.id.includes("ultra") ? "Highest quality • Slowest" : "Balanced quality"}
                          </p>
                        </div>
                        {modelId === m.id && <Check className="w-3.5 h-3.5 ml-auto text-accent" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Aspect ratio */}
          <div>
            <p className="label-section mb-2.5">Aspect Ratio</p>
            <div className="grid grid-cols-5 gap-1.5">
              {ASPECT_RATIOS.map((r) => (
                <AspectRatioTile
                  key={r.id}
                  ratio={r}
                  selected={ratio === r.id}
                  onClick={() => setRatio(r.id)}
                />
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <p className="label-section mb-2.5">Images</p>
            <div className="flex gap-1.5">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={cn(
                    "w-10 h-10 rounded-[var(--radius-md)] text-sm font-medium border transition-colors cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    count === n
                      ? "bg-accent/10 border-accent/50 text-accent"
                      : "bg-transparent border-glass-border text-text-2 hover:border-glass-border-strong hover:text-text-1",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Negative prompt (collapsible) */}
          <div>
            <button
              onClick={() => setShowNegative((s) => !s)}
              className="flex items-center gap-1.5 text-xs text-text-3 hover:text-text-2 transition-colors cursor-pointer"
            >
              {showNegative ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              Negative prompt
            </button>
            <AnimatePresence>
              {showNegative && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="What to avoid: blurry, low quality, text, watermark…"
                    rows={3}
                    className="mt-2 w-full bg-bg-input border border-glass-border rounded-[var(--radius-md)] text-xs text-text-1
                      placeholder:text-text-3 p-3 resize-none focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/20 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generate CTA */}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "w-full h-12 rounded-full font-bold text-sm font-display tracking-wide transition-all duration-200 cursor-pointer",
              "bg-accent text-white hover:bg-accent-hover",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              loading && "opacity-70",
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Generate {count > 1 ? `${count} Images` : "Image"}
                <span className="text-white/60 text-xs">({count} cr)</span>
              </span>
            )}
          </Button>

          {images.length > 0 && (
            <button
              onClick={() => { setImages([]); setHasGenerated(false); }}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-text-3 hover:text-text-2 transition-colors py-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear results
            </button>
          )}
        </motion.div>

        {/* ── Right: Results ── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="min-h-[300px] lg:min-h-[500px]"
        >
          {!hasGenerated && !loading ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] lg:min-h-[500px] rounded-[var(--radius-lg)] bg-bg-2/50 border border-dashed border-glass-border text-center gap-5 p-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-accent/5 border border-glass-border flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-text-3/60" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-accent2/10 border border-accent2/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-accent2" />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-text-1 font-medium">Your images will appear here</p>
                <p className="text-text-3 text-sm max-w-xs mx-auto">Write a prompt and hit Generate to bring your vision to life</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {["Product photo", "Character design", "Abstract art"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setPrompt(hint.toLowerCase() + ", ")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-text-3
                      bg-glass border border-glass-border hover:bg-glass-hover hover:text-text-2 transition-colors cursor-pointer"
                  >
                    <Palette className="w-3 h-3" />
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <SkeletonGrid count={count} ratio={ratio} />
          ) : (
            <div className="space-y-4">
              {/* Credit usage badge */}
              {creditsUsed > 0 && (
                <div className="flex items-center gap-2 text-xs text-text-3">
                  <Zap className="w-3 h-3 text-accent" />
                  <span>{creditsUsed} credit{creditsUsed > 1 ? "s" : ""} used</span>
                  <span className="text-text-3/50">·</span>
                  <span>{credits} remaining</span>
                </div>
              )}

              <div
                className={cn(
                  "grid gap-4",
                  images.length === 1 ? "grid-cols-1 max-w-lg" : "grid-cols-1 sm:grid-cols-2",
                )}
              >
                {images.map((img, i) => (
                  <ImageResultCard
                    key={img.id}
                    image={img}
                    index={i}
                    ratio={ratio}
                    onDownload={() => handleDownload(img, i)}
                    onCopy={() => handleCopyPrompt(img)}
                  />
                ))}
              </div>

              {/* Validation gate — floats below results */}
              <div className="flex justify-center pt-2">
                <ValidationGate
                  visible={showValidation}
                  onRate={(rating) => {
                    addToast({
                      message: rating === "up" ? "Glad you liked it!" : "We'll improve — thanks for feedback",
                      type: "info",
                    });
                  }}
                  onDismiss={() => setShowValidation(false)}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Page export (wraps in Suspense for useSearchParams) ── */
export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageInner />
    </Suspense>
  );
}
