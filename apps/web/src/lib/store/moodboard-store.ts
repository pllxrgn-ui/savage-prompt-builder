import { create } from "zustand";
import { persist } from "zustand/middleware";
// Imported lazily inside applyToBuilder to avoid potential circular-dep issues at module init time.
// Using getState() is safe — it bypasses the React hook lifecycle.
import { useBuilderStore } from "./builder-store";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface MoodboardImage {
  id: string;
  url: string;
  alt: string;
  source: "upload" | "url" | "gallery";
  addedAt: string;
}

export interface Moodboard {
  id: string;
  name: string;
  images: MoodboardImage[];
  mood: string;
  createdAt: string;
  updatedAt: string;
}

interface MoodboardState {
  boards: Moodboard[];
  activeBoardId: string | null;
}

interface MoodboardActions {
  createBoard: (name?: string) => string;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  setActiveBoardId: (id: string) => void;
  setBoardMood: (boardId: string, mood: string) => void;
  addImage: (boardId: string, image: Omit<MoodboardImage, "id" | "addedAt">) => void;
  removeImage: (boardId: string, imageId: string) => void;
  applyToBuilder: (boardId: string) => void;
}

export type MoodboardStore = MoodboardState & MoodboardActions;

export const useMoodboardStore = create<MoodboardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      activeBoardId: null,

      createBoard: (name) => {
        const id = generateId();
        const now = new Date().toISOString();
        const boardCount = get().boards.length;
        const board: Moodboard = {
          id,
          name: name ?? `Board ${boardCount + 1}`,
          images: [],
          mood: "",
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          boards: [...state.boards, board],
          activeBoardId: id,
        }));
        return id;
      },

      deleteBoard: (id) =>
        set((state) => {
          const boards = state.boards.filter((b) => b.id !== id);
          const activeBoardId =
            state.activeBoardId === id
              ? (boards[0]?.id ?? null)
              : state.activeBoardId;
          return { boards, activeBoardId };
        }),

      renameBoard: (id, name) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === id ? { ...b, name, updatedAt: new Date().toISOString() } : b,
          ),
        })),

      setActiveBoardId: (id) => set({ activeBoardId: id }),

      setBoardMood: (boardId, mood) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, mood, updatedAt: new Date().toISOString() }
              : b,
          ),
        })),

      addImage: (boardId, image) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  images: [
                    ...b.images,
                    { ...image, id: generateId(), addedAt: new Date().toISOString() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : b,
          ),
        })),

      removeImage: (boardId, imageId) =>
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  images: b.images.filter((img) => img.id !== imageId),
                  updatedAt: new Date().toISOString(),
                }
              : b,
          ),
        })),

      applyToBuilder: (boardId) => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return;
        const builderStore = useBuilderStore.getState();
        builderStore.setMood(board.mood);
        if (board.images.length > 0 && board.images[0]) {
          builderStore.setReferenceImageUrl(board.images[0].url);
        }
      },
    }),
    { name: "spb-moodboard" },
  ),
);
