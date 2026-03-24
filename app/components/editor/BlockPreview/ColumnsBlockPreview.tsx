"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { columnsShapeFix } from "@/lib/editor/columns-helpers";
import { useTemplateStore } from "@/lib/editor/template-store";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getAlign, getColor, getWrapperClass, getTextBlockStyle } from "./shared";
import { TextBlockPreview } from "./TextBlockPreview";
import { ButtonBlockPreview } from "./ButtonBlockPreview";
import { ImageBlockPreview } from "./ImageBlockPreview";
import {
  SortableColumnChild,
  columnChildDndId,
} from "./SortableColumnChild";

interface ColumnsBlockPreviewProps {
  block: MJMLBlock;
  isSelected: boolean;
  className?: string;
}

/**
 * Columns / grid block: N horizontal slots, each with nested text | image | button.
 * Selection: grid (A), column (B), or child (C) via store `columnsSelection`.
 */
export function ColumnsBlockPreview({
  block,
  isSelected,
  className = "",
}: ColumnsBlockPreviewProps) {
  const {
    columnsSelection,
    setColumnsSelection,
    setActiveBlockId,
    updateColumnChild,
    removeColumnChild,
    updateBlock,
  } = useTemplateStore();

  const n = (block.columnCount ?? 1) as 1 | 2 | 3 | 4;

  useEffect(() => {
    const fix = columnsShapeFix(block);
    if (fix) updateBlock(block.id, fix);
  }, [
    block.id,
    block.type,
    block.columnCount,
    block.columnSlots?.length,
    updateBlock,
    block,
  ]);

  const slots = Array.from({ length: n }, (_, i) => {
    const s = block.columnSlots?.[i];
    return s ?? { id: `${block.id}-col-${i}`, blocks: [] as MJMLBlock[] };
  });

  const gapCss = (block.columnGap ?? "16px").trim() || "16px";

  const isGridSelected =
    isSelected &&
    columnsSelection?.kind === "columns-block" &&
    columnsSelection.blockId === block.id;

  const handleSelectGrid = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBlockId(block.id);
    setColumnsSelection({ kind: "columns-block", blockId: block.id });
  };

  const handleSelectColumn = (e: React.MouseEvent, columnIndex: number) => {
    e.stopPropagation();
    setActiveBlockId(block.id);
    setColumnsSelection({
      kind: "column",
      blockId: block.id,
      columnIndex,
    });
  };

  const handleSelectChild = (e: React.MouseEvent, columnIndex: number, childId: string) => {
    e.stopPropagation();
    setActiveBlockId(block.id);
    setColumnsSelection({
      kind: "column-child",
      blockId: block.id,
      columnIndex,
      childId,
    });
  };

  return (
    <div className={`rounded-lg ${className}`} role="presentation">
      <div
        className={`rounded-lg border-2 transition-colors min-h-[80px] p-2 ${
          isGridSelected
            ? "border-accent ring-1 ring-accent/40"
            : "border-transparent hover:border-neutral-300/90"
        }`}
      >
        <div
          className="flex flex-row items-stretch w-full"
          style={{ gap: gapCss }}
          onClick={(e) => e.stopPropagation()}
        >
          {slots.map((slot, columnIndex) => {
            const colSelected =
              isSelected &&
              columnsSelection?.blockId === block.id &&
              columnsSelection.kind === "column" &&
              columnsSelection.columnIndex === columnIndex;
            const childSelected = (childId: string) =>
              isSelected &&
              columnsSelection?.blockId === block.id &&
              columnsSelection.kind === "column-child" &&
              columnsSelection.columnIndex === columnIndex &&
              columnsSelection.childId === childId;

            return (
              <div
                key={slot.id}
                className={`flex-1 min-w-0 flex flex-col rounded-md border-2 border-dashed transition-colors ${
                  colSelected
                    ? "border-accent/80 bg-accent/5"
                    : "border-neutral-300/80 bg-neutral-100/40"
                }`}
                onClick={(e) => handleSelectColumn(e, columnIndex)}
                role="presentation"
              >
            
                <div className="flex flex-col gap-1 px-1 pb-2 flex-1 min-h-0">
                  {slot.blocks.length === 0 ? (
                    <div
                      className="flex flex-1 min-h-[100px] items-center justify-center py-4"
                      aria-hidden
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed text-accent transition-colors ${
                          colSelected
                            ? "border-accent/70 bg-accent/15"
                            : "border-accent/40 bg-accent/10"
                        }`}
                      >
                        <Plus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                      </div>
                    </div>
                  ) : (
                    <SortableContext
                      items={slot.blocks.map((c) =>
                        columnChildDndId(block.id, columnIndex, c.id),
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      {slot.blocks.map((child) => {
                        const align = getAlign(child);
                        const color = getColor(child);
                        const wrapperClass = getWrapperClass(align, false, "");
                        const sel = childSelected(child.id);
                        return (
                          <SortableColumnChild
                            key={child.id}
                            childId={child.id}
                            columnsBlockId={block.id}
                            columnIndex={columnIndex}
                            isSelected={sel}
                            className={`rounded-md ${
                              sel
                                ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
                                : ""
                            }`}
                            onContentClick={(e) =>
                              handleSelectChild(e, columnIndex, child.id)
                            }
                          >
                            {child.type === "text" && (
                              <TextBlockPreview
                                block={child}
                                wrapperClass={wrapperClass}
                                style={getTextBlockStyle(child, align, color)}
                                onBlockUpdate={(updates) =>
                                  updateColumnChild(
                                    block.id,
                                    columnIndex,
                                    child.id,
                                    updates,
                                  )
                                }
                                onFocusBlock={() => {
                                  setActiveBlockId(block.id);
                                  setColumnsSelection({
                                    kind: "column-child",
                                    blockId: block.id,
                                    columnIndex,
                                    childId: child.id,
                                  });
                                }}
                              />
                            )}
                            {child.type === "image" && (
                              <ImageBlockPreview
                                block={child}
                                wrapperClass={wrapperClass}
                              />
                            )}
                            {child.type === "button" && (
                              <ButtonBlockPreview
                                block={child}
                                wrapperClass={wrapperClass}
                              />
                            )}
                            {sel && (
                              <div className="flex justify-end px-1 pb-1">
                                <button
                                  type="button"
                                  className="text-[10px] text-red-400 hover:text-red-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeColumnChild(
                                      block.id,
                                      columnIndex,
                                      child.id,
                                    );
                                  }}
                                >
                                  Remove block
                                </button>
                              </div>
                            )}
                          </SortableColumnChild>
                        );
                      })}
                    </SortableContext>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
