"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  startOnMount?: boolean;
}

export function TypingAnimation({
  text,
  duration = 60,
  className,
  startOnMount = true,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    if (!startOnMount) return;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [duration, i, text, startOnMount]);

  return (
    <span className={cn("font-display", className)}>
      {displayedText ? displayedText : null}
      <span className="inline-block w-[2px] h-[1em] align-middle bg-current animate-pulse ml-0.5" />
    </span>
  );
}
