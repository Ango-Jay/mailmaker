import { create } from "zustand";

export type ImageUploadModalMode = "add" | "edit";

export interface ImageColumnContext {
  columnsBlockId: string;
  columnIndex: number;
  childId: string;
}

export interface ImageUploadModalState {
  isOpen: boolean;
  mode: ImageUploadModalMode;
  /** When mode is "edit", the top-level block to update. */
  blockId: string | null;
  /** When adding an image into a columns cell, set before open. */
  columnAddContext: { columnsBlockId: string; columnIndex: number } | null;
  /** When editing an image nested in a column. */
  imageColumnContext: ImageColumnContext | null;
  openForAdd: () => void;
  openForEdit: (blockId: string) => void;
  openForColumnAdd: (columnsBlockId: string, columnIndex: number) => void;
  openForEditColumnImage: (ctx: ImageColumnContext) => void;
  close: () => void;
}

export const useImageUploadModalStore = create<ImageUploadModalState>((set) => ({
  isOpen: false,
  mode: "add",
  blockId: null,
  columnAddContext: null,
  imageColumnContext: null,
  openForAdd: () =>
    set({
      isOpen: true,
      mode: "add",
      blockId: null,
      columnAddContext: null,
      imageColumnContext: null,
    }),
  openForEdit: (blockId) =>
    set({
      isOpen: true,
      mode: "edit",
      blockId,
      columnAddContext: null,
      imageColumnContext: null,
    }),
  openForColumnAdd: (columnsBlockId, columnIndex) =>
    set({
      isOpen: true,
      mode: "add",
      blockId: null,
      columnAddContext: { columnsBlockId, columnIndex },
      imageColumnContext: null,
    }),
  openForEditColumnImage: (ctx) =>
    set({
      isOpen: true,
      mode: "edit",
      blockId: null,
      columnAddContext: null,
      imageColumnContext: ctx,
    }),
  close: () =>
    set({
      isOpen: false,
      mode: "add",
      blockId: null,
      columnAddContext: null,
      imageColumnContext: null,
    }),
}));
