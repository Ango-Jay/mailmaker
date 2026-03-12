import { create } from "zustand";
import { nanoid } from "nanoid";
import type { MJMLBlock } from "./block-types";

/**
 * Email template store.
 *
 * The template is an array of blocks (basic blocks + prebuilt cards). Both
 * preview and generated output are derived from this blocks array only:
 *
 * - Preview: HTML for the canvas = mjml2html(blocksToGeneratedMjml(blocks, activeBlockId))
 * - Generated: MJML for export = blocksToGeneratedMjml(blocks)
 *
 * Use blocksToGeneratedMjml from @/lib/editor/blocks-to-mjml to get either form.
 */
export interface TemplateState {
  /** Ordered list of email template blocks (basic blocks and prebuilt cards). */
  blocks: MJMLBlock[];
  /** ID of the block currently selected in the editor. */
  activeBlockId: string | null;

  setBlocks: (blocks: MJMLBlock[]) => void;
  setActiveBlockId: (id: string | null) => void;

  addBlock: (block: Omit<MJMLBlock, "id">, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<MJMLBlock>) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  /** Reorder by block ids (for dnd-kit). */
  reorderBlocksById: (activeId: string, overId: string) => void;

  /** Get a single block by id. */
  getBlock: (id: string) => MJMLBlock | undefined;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  blocks: [],
  activeBlockId: null,

  setBlocks: (blocks) => set({ blocks }),

  setActiveBlockId: (id) => set({ activeBlockId: id }),

  addBlock: (block, index) =>
    set((state) => {
      const newBlock: MJMLBlock = { ...block, id: nanoid() };
      const blocks =
        index !== undefined
          ? [
              ...state.blocks.slice(0, index),
              newBlock,
              ...state.blocks.slice(index),
            ]
          : [...state.blocks, newBlock];
      return { blocks };
    }),

  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
      activeBlockId: state.activeBlockId === id ? null : state.activeBlockId,
    })),

  updateBlock: (id, updates) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, ...updates } : b,
      ),
    })),

  reorderBlocks: (fromIndex, toIndex) =>
    set((state) => {
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { blocks };
    }),

  reorderBlocksById: (activeId, overId) =>
    set((state) => {
      const fromIndex = state.blocks.findIndex((b) => b.id === activeId);
      const toIndex = state.blocks.findIndex((b) => b.id === overId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return state;
      const blocks = [...state.blocks];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      return { blocks };
    }),

  getBlock: (id) => get().blocks.find((b) => b.id === id),
}));
