import { nanoid } from "nanoid";
import type { MJMLBlock } from "./block-types";

export function createColumnSlots(count: 1 | 2 | 3 | 4): { id: string; blocks: MJMLBlock[] }[] {
  return Array.from({ length: count }, () => ({
    id: nanoid(),
    blocks: [] as MJMLBlock[],
  }));
}

/** Default payload for a new columns block (id added by addBlock). */
export function createColumnsBlockPayload(columnCount: 1 | 2 | 3 | 4): Omit<MJMLBlock, "id"> {
  return {
    type: "columns",
    columnCount,
    columnGap: "16px",
    columnSlots: createColumnSlots(columnCount),
  };
}

export function isColumnChildType(type: string): type is "text" | "image" | "button" {
  return type === "text" || type === "image" || type === "button";
}

/** If columnSlots length ≠ columnCount, returns updates to fix (else null). */
export function columnsShapeFix(block: MJMLBlock): Pick<MJMLBlock, "columnSlots" | "columnCount"> | null {
  if (block.type !== "columns") return null;
  const n = (block.columnCount ?? 1) as 1 | 2 | 3 | 4;
  let slots = [...(block.columnSlots ?? [])];
  let changed = false;
  while (slots.length < n) {
    slots.push({ id: nanoid(), blocks: [] });
    changed = true;
  }
  if (slots.length > n) {
    slots = slots.slice(0, n);
    changed = true;
  }
  if (!changed) return null;
  return { columnSlots: slots, columnCount: n };
}
