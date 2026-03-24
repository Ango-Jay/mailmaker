import { create } from "zustand";
import { nanoid } from "nanoid";
import type { MJMLBlock } from "./block-types";
import { createColumnSlots, isColumnChildType } from "./columns-helpers";

export type ColumnsSelection =
  | { kind: "columns-block"; blockId: string }
  | { kind: "column"; blockId: string; columnIndex: number }
  | { kind: "column-child"; blockId: string; columnIndex: number; childId: string };

/**
 * Email template store.
 *
 * The template is an array of blocks. We have two representations:
 *
 * 1. PREVIEW – What we show in the editor canvas so the user can edit.
 *    Implemented as React components (BlockPreview). Not the same as the
 *    final email HTML; it’s a visual approximation for the editor.
 *
 * 2. GENERATED OUTPUT – Email-friendly HTML from MJML (inline styles,
 *    table-based layout for clients). Produced by:
 *    blocksToGeneratedMjml(blocks) → mjml2html() → HTML.
 *    Used for export (ExportHtmlModal) and for sending emails.
 *
 * Both are derived from this blocks array only.
 */
export interface TemplateState {
  /** Ordered list of email template blocks (basic blocks and prebuilt cards). */
  blocks: MJMLBlock[];
  /** ID of the block currently selected in the editor. */
  activeBlockId: string | null;
  /** Nested selection inside a `columns` block (grid vs column vs child). */
  columnsSelection: ColumnsSelection | null;

  setBlocks: (blocks: MJMLBlock[]) => void;
  setActiveBlockId: (id: string | null) => void;
  setColumnsSelection: (sel: ColumnsSelection | null) => void;
  /** Select a top-level block and clear nested columns selection when not a columns block. */
  selectTopLevelBlock: (id: string | null) => void;

  addBlock: (block: Omit<MJMLBlock, "id">, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<MJMLBlock>) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  /** Reorder by block ids (for dnd-kit). */
  reorderBlocksById: (activeId: string, overId: string) => void;

  /** Get a single block by id. */
  getBlock: (id: string) => MJMLBlock | undefined;

  addColumnChild: (
    columnsBlockId: string,
    columnIndex: number,
    child: Omit<MJMLBlock, "id">,
  ) => void;
  updateColumnChild: (
    columnsBlockId: string,
    columnIndex: number,
    childId: string,
    updates: Partial<MJMLBlock>,
  ) => void;
  removeColumnChild: (
    columnsBlockId: string,
    columnIndex: number,
    childId: string,
  ) => void;
  reorderColumnChildren: (
    columnsBlockId: string,
    columnIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => void;
  setColumnsBlockColumnCount: (columnsBlockId: string, newCount: 1 | 2 | 3 | 4) => void;
}

function normalizeColumnSlots(block: MJMLBlock): MJMLBlock {
  if (block.type !== "columns") return block;
  const n = (block.columnCount ?? 1) as 1 | 2 | 3 | 4;
  let slots = [...(block.columnSlots ?? [])];
  while (slots.length < n) {
    slots.push({ id: nanoid(), blocks: [] });
  }
  slots = slots.slice(0, n);
  return { ...block, columnSlots: slots, columnCount: n };
}

function mapColumnsBlock(
  blocks: MJMLBlock[],
  columnsBlockId: string,
  fn: (block: MJMLBlock) => MJMLBlock,
): MJMLBlock[] {
  return blocks.map((b) =>
    b.id === columnsBlockId && b.type === "columns" ? fn(normalizeColumnSlots(b)) : b,
  );
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  blocks: [],
  activeBlockId: null,
  columnsSelection: null,

  setBlocks: (blocks) => set({ blocks }),

  setActiveBlockId: (id) => set({ activeBlockId: id }),

  setColumnsSelection: (sel) => set({ columnsSelection: sel }),

  selectTopLevelBlock: (id) =>
    set((state) => {
      if (!id) {
        return { activeBlockId: null, columnsSelection: null };
      }
      const block = state.blocks.find((b) => b.id === id);
      if (!block) {
        return { activeBlockId: id, columnsSelection: null };
      }
      if (block.type === "columns") {
        return {
          activeBlockId: id,
          columnsSelection: { kind: "columns-block", blockId: id },
        };
      }
      return { activeBlockId: id, columnsSelection: null };
    }),

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
      columnsSelection:
        state.columnsSelection?.blockId === id ? null : state.columnsSelection,
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

  addColumnChild: (columnsBlockId, columnIndex, child) =>
    set((state) => {
      if (!isColumnChildType(child.type)) return state;
      const newChild: MJMLBlock = { ...child, id: nanoid() };
      return {
        blocks: mapColumnsBlock(state.blocks, columnsBlockId, (block) => {
          const count = block.columnCount ?? 1;
          const slots = block.columnSlots ?? createColumnSlots(count as 1 | 2 | 3 | 4);
          if (columnIndex < 0 || columnIndex >= slots.length) return block;
          const next = slots.map((s, i) =>
            i === columnIndex ? { ...s, blocks: [...s.blocks, newChild] } : s,
          );
          return { ...block, columnSlots: next };
        }),
        columnsSelection: {
          kind: "column-child",
          blockId: columnsBlockId,
          columnIndex,
          childId: newChild.id,
        },
        activeBlockId: columnsBlockId,
      };
    }),

  updateColumnChild: (columnsBlockId, columnIndex, childId, updates) =>
    set((state) => ({
      blocks: mapColumnsBlock(state.blocks, columnsBlockId, (block) => {
        const count = block.columnCount ?? 1;
        const slots = block.columnSlots ?? createColumnSlots(count as 1 | 2 | 3 | 4);
        if (columnIndex < 0 || columnIndex >= slots.length) return block;
        const next = slots.map((s, i) => {
          if (i !== columnIndex) return s;
          return {
            ...s,
            blocks: s.blocks.map((c) =>
              c.id === childId ? { ...c, ...updates } : c,
            ),
          };
        });
        return { ...block, columnSlots: next };
      }),
    })),

  removeColumnChild: (columnsBlockId, columnIndex, childId) =>
    set((state) => {
      const cs = state.columnsSelection;
      const nextSel =
        cs?.kind === "column-child" &&
        cs.blockId === columnsBlockId &&
        cs.columnIndex === columnIndex &&
        cs.childId === childId
          ? ({ kind: "column", blockId: columnsBlockId, columnIndex } as const)
          : cs;
      return {
        blocks: mapColumnsBlock(state.blocks, columnsBlockId, (block) => {
          const count = block.columnCount ?? 1;
          const slots = block.columnSlots ?? createColumnSlots(count as 1 | 2 | 3 | 4);
          if (columnIndex < 0 || columnIndex >= slots.length) return block;
          const next = slots.map((s, i) =>
            i === columnIndex
              ? { ...s, blocks: s.blocks.filter((c) => c.id !== childId) }
              : s,
          );
          return { ...block, columnSlots: next };
        }),
        columnsSelection: nextSel,
      };
    }),

  reorderColumnChildren: (columnsBlockId, columnIndex, fromIndex, toIndex) =>
    set((state) => ({
      blocks: mapColumnsBlock(state.blocks, columnsBlockId, (block) => {
        const count = block.columnCount ?? 1;
        const slots = block.columnSlots ?? createColumnSlots(count as 1 | 2 | 3 | 4);
        if (columnIndex < 0 || columnIndex >= slots.length) return block;
        const next = slots.map((s, i) => {
          if (i !== columnIndex) return s;
          const arr = [...s.blocks];
          if (
            fromIndex < 0 ||
            fromIndex >= arr.length ||
            toIndex < 0 ||
            toIndex >= arr.length
          ) {
            return s;
          }
          const [removed] = arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, removed);
          return { ...s, blocks: arr };
        });
        return { ...block, columnSlots: next };
      }),
    })),

  setColumnsBlockColumnCount: (columnsBlockId, newCount) =>
    set((state) => ({
      blocks: mapColumnsBlock(state.blocks, columnsBlockId, (block) => {
        const oldCount = (block.columnCount ?? 1) as 1 | 2 | 3 | 4;
        let slots = [...(block.columnSlots ?? createColumnSlots(oldCount))];
        if (newCount > oldCount) {
          while (slots.length < newCount) {
            slots.push({ id: nanoid(), blocks: [] });
          }
        } else {
          slots = slots.slice(0, newCount);
        }
        return {
          ...block,
          columnCount: newCount,
          columnSlots: slots,
        };
      }),
      columnsSelection: (() => {
        const cs = state.columnsSelection;
        if (!cs || cs.blockId !== columnsBlockId) return cs;
        if (cs.kind === "columns-block") return cs;
        if (cs.kind === "column" && cs.columnIndex >= newCount) {
          return { kind: "columns-block", blockId: columnsBlockId };
        }
        if (
          cs.kind === "column-child" &&
          (cs.columnIndex >= newCount ||
            !state.blocks
              .find((b) => b.id === columnsBlockId)
              ?.columnSlots?.[cs.columnIndex]?.blocks.some((c) => c.id === cs.childId))
        ) {
          return { kind: "columns-block", blockId: columnsBlockId };
        }
        return cs;
      })(),
    })),
}));
