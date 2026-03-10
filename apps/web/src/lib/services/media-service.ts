/**
 * Media service — stub implementation using localStorage.
 * BACKEND: Replace with fetch('/api/media', ...) + auth header.
 */
import type { GeneratedImage } from "./generate-service";

const STORAGE_KEY = "spb-media";

function readMedia(): GeneratedImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GeneratedImage[]) : [];
  } catch {
    return [];
  }
}

function writeMedia(items: GeneratedImage[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// BACKEND: GET /api/media
export function getMedia(): GeneratedImage[] {
  return readMedia();
}

// BACKEND: POST /api/media
export function saveMedia(images: GeneratedImage[]): void {
  const existing = readMedia();
  const existingIds = new Set(existing.map((m) => m.id));
  const newItems = images.filter((img) => !existingIds.has(img.id));
  writeMedia([...newItems, ...existing]);
}

// BACKEND: DELETE /api/media/[id]
export function deleteMedia(id: string): void {
  writeMedia(readMedia().filter((m) => m.id !== id));
}

// BACKEND: POST /api/media/upload (for reference images, etc.)
export async function uploadMedia(
  _file: File,
): Promise<{ url: string }> {
  // Stub: convert to data URI
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result as string });
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(_file);
  });
}
