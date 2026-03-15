"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/lib/store";
import { MoodInput, ReferenceImageUpload } from "@/components/builder/ReferenceImage";
import { Button } from "@/components/ui/button";
import { MasonryShowcase } from "@/components/ui/MasonryShowcase";

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

export default function MoodboardPage() {
  const router = useRouter();
  const mood = useBuilderStore((s) => s.mood);
  const setMood = useBuilderStore((s) => s.setMood);
  const referenceImageUrl = useBuilderStore((s) => s.referenceImageUrl);
  const activeTemplateId = useBuilderStore((s) => s.activeTemplateId);
  const [showCreator, setShowCreator] = useState(!!mood || !!referenceImageUrl);

  function handleContinue() {
    router.push("/builder");
  }

  if (!showCreator) {
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
            Set the visual direction for your prompt. Describe the mood, upload
            reference images, and let the AI capture the vibe you&apos;re after.
          </p>

          {/* Mood preview chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {MOOD_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setMood(preset);
                  setShowCreator(true);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-text-3 border border-glass-border hover:border-accent/30 hover:text-accent hover:bg-accent/5 transition-colors duration-150 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setShowCreator(true)}
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

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 md:px-8 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="font-heading text-xl font-bold text-text-1">Moodboard</h1>
          <p className="text-xs text-text-3">Set the visual direction for your prompt</p>
        </div>

        {/* Quick mood chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {MOOD_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setMood(mood === preset ? "" : preset)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer",
                mood === preset
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-text-3 border border-glass-border hover:border-accent/30 hover:text-text-1 hover:bg-glass",
              )}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Mood input */}
        <MoodInput />

        {/* Reference image */}
        <ReferenceImageUpload />

        {/* Continue */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <p className="text-[11px] text-text-3">
            {activeTemplateId
              ? "Your mood will be applied to the current template."
              : "Pick a template next in the Builder."}
          </p>
          <Button
            onClick={handleContinue}
            className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 transition-colors duration-150 cursor-pointer"
          >
            Continue to Builder
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
