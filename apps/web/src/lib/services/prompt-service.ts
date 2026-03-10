import { useHistoryStore } from "@/lib/store";
import type { SavedPrompt } from "@/types";

// BACKEND: Replace with fetch('/api/prompts', ...) + auth header

export function savePrompt(
  data: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt">,
): SavedPrompt {
  const store = useHistoryStore.getState();
  store.savePrompt(data);
  const saved = store.savedPrompts[0]!;
  return saved;
}

export function iteratePrompt(
  parentId: string,
  data: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt" | "parentId" | "version">,
): SavedPrompt {
  const store = useHistoryStore.getState();
  const parent = store.savedPrompts.find((p) => p.id === parentId);
  const version = parent ? parent.version + 1 : 1;

  store.savePrompt({
    ...data,
    parentId,
    version,
  });

  return store.savedPrompts[0]!;
}

export function getPrompts(): SavedPrompt[] {
  return useHistoryStore.getState().savedPrompts;
}

export function deletePrompt(id: string): void {
  useHistoryStore.getState().deletePrompt(id);
}

export function updatePrompt(id: string, updates: Partial<SavedPrompt>): void {
  useHistoryStore.getState().updatePrompt(id, updates);
}

export function toggleStar(id: string): void {
  useHistoryStore.getState().toggleStar(id);
}

export function getVersionChain(promptId: string): SavedPrompt[] {
  const all = useHistoryStore.getState().savedPrompts;
  const target = all.find((p) => p.id === promptId);
  if (!target) return [];

  // Find root of chain
  let rootId = target.id;
  let current = target;
  while (current.parentId) {
    const parent = all.find((p) => p.id === current.parentId);
    if (!parent) break;
    rootId = parent.id;
    current = parent;
  }

  // Collect chain from root
  const chain: SavedPrompt[] = [];
  let node: SavedPrompt | undefined = all.find((p) => p.id === rootId);
  while (node) {
    chain.push(node);
    node = all.find((p) => p.parentId === node!.id);
  }

  return chain;
}
