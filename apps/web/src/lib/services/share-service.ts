import { useBuilderStore } from "@/lib/store";
import type { GeneratorId } from "@/types";

interface SharePayload {
  t: string; // templateId
  f: Record<string, string>; // fields
  s: string[]; // styles
  p: string | null; // palette
  k: string[]; // keywords
  n: string; // negative
  g: string; // generator
  ph: string[]; // phrases
  gm: string; // garmentMode
  m: { e: boolean; i: string; c: string; d: string } | null; // mockup
}

const MAX_URL_LENGTH = 2000;

export function encodeBuilderState(): string {
  const state = useBuilderStore.getState();
  const payload: SharePayload = {
    t: state.activeTemplateId ?? "",
    f: state.templateFields,
    s: state.selectedStyles,
    p: state.selectedPalette,
    k: state.selectedKeywords,
    n: state.negativePrompt,
    g: state.selectedGenerator,
    ph: state.selectedPhrases,
    gm: state.garmentMode ?? "",
    m: state.mockup.enabled
      ? {
          e: true,
          i: state.mockup.item,
          c: state.mockup.color,
          d: state.mockup.display,
        }
      : null,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeBuilderState(encoded: string): boolean {
  try {
    const payload: SharePayload = JSON.parse(atob(encoded));
    if (!payload.t) return false;

    const store = useBuilderStore.getState();
    store.setTemplate(payload.t);
    for (const [key, value] of Object.entries(payload.f)) {
      store.setField(key, value);
    }
    for (const style of payload.s) {
      if (!store.selectedStyles.includes(style)) {
        store.toggleStyle(style);
      }
    }
    if (payload.p) store.setPalette(payload.p);
    if (payload.n) store.setNegative(payload.n);
    store.setGenerator(payload.g as GeneratorId);
    for (const phrase of payload.ph) {
      if (!store.selectedPhrases.includes(phrase)) {
        store.togglePhrase(phrase);
      }
    }
    if (payload.m) {
      store.setMockup({
        enabled: true,
        item: payload.m.i,
        color: payload.m.c,
        display: payload.m.d,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function getShareUrlAsync(): Promise<{ url: string; tooLong: boolean }> {
  const encoded = encodeBuilderState();
  
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: encoded })
    });
    
    if (res.ok) {
      const { id } = await res.json();
      const url = `${window.location.origin}/builder?sid=${id}`;
      return { url, tooLong: false };
    }
  } catch (error) {
    console.error('Failed to generate short link', error);
  }

  // Fallback
  const url = `${window.location.origin}/builder?share=${encoded}`;
  return { url, tooLong: url.length > MAX_URL_LENGTH };
}

export function getShareUrl(): { url: string; tooLong: boolean } {
  const encoded = encodeBuilderState();
  const url = `${window.location.origin}/builder?share=${encoded}`;
  return { url, tooLong: url.length > MAX_URL_LENGTH };
}

export async function copyShareUrl(): Promise<{
  success: boolean;
  tooLong: boolean;
}> {
  const { url, tooLong } = await getShareUrlAsync();
  await navigator.clipboard.writeText(url);
  return { success: true, tooLong };
}
