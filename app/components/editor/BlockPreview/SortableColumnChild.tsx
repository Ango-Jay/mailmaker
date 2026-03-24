"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/** Stable unique id for dnd-kit (distinct from top-level block ids). */
export function columnChildDndId(
  columnsBlockId: string,
  columnIndex: number,
  childId: string,
): string {
  return `colchild:${columnsBlockId}:${columnIndex}:${childId}`;
}

export function parseColumnChildSortableId(id: string): {
  columnsBlockId: string;
  columnIndex: number;
  childId: string;
} | null {
  const prefix = "colchild:";
  if (!id.startsWith(prefix)) return null;
  const rest = id.slice(prefix.length);
  const seg = rest.split(":");
  if (seg.length < 3) return null;
  const columnsBlockId = seg[0]!;
  const columnIndex = parseInt(seg[1]!, 10);
  if (Number.isNaN(columnIndex)) return null;
  const childId = seg.slice(2).join(":");
  return { columnsBlockId, columnIndex, childId };
}

interface SortableColumnChildProps {
  childId: string;
  columnsBlockId: string;
  columnIndex: number;
  className?: string;
  onContentClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

/**
 * Draggable row for a block inside a columns cell. Drag via the grip only
 * so text editing and buttons are unaffected.
 */
export function SortableColumnChild({
  childId,
  columnsBlockId,
  columnIndex,
  className = "",
  onContentClick,
  children,
}: SortableColumnChildProps) {
  const sortableId = columnChildDndId(columnsBlockId, columnIndex, childId);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${className}`.trim()}
      {...attributes}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...listeners}
        className="absolute left-0 top-1 z-10 flex h-8 w-7 cursor-grab touch-none items-center justify-center rounded-md border border-neutral-300/90 bg-neutral-100/90 text-neutral-500 shadow-sm hover:border-accent/50 hover:bg-accent/10 hover:text-accent active:cursor-grabbing"
        aria-label="Drag to reorder block in column"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" strokeWidth={2} />
      </button>
      <div
        className="min-w-0"
        onClick={onContentClick}
        role="presentation"
      >
        {children}
      </div>
    </div>
  );
}
