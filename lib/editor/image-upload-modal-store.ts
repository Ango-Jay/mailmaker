import { create } from "zustand";

export type ImageUploadModalMode = "add" | "edit";

export interface ImageUploadModalState {
  isOpen: boolean;
  mode: ImageUploadModalMode;
  /** When mode is "edit", the block to update. */
  blockId: string | null;
  openForAdd: () => void;
  openForEdit: (blockId: string) => void;
  close: () => void;
}

export const useImageUploadModalStore = create<ImageUploadModalState>((set) => ({
  isOpen: false,
  mode: "add",
  blockId: null,
  openForAdd: () => set({ isOpen: true, mode: "add", blockId: null }),
  openForEdit: (blockId) => set({ isOpen: true, mode: "edit", blockId }),
  close: () => set({ isOpen: false, mode: "add", blockId: null }),
}));
