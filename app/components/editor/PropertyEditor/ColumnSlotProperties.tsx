"use client";

import React from "react";
import { Type, Image as ImageIcon, MousePointer2, LayoutGrid } from "lucide-react";
import { useTemplateStore } from "@/lib/editor/template-store";
import { useImageUploadModalStore } from "@/lib/editor/image-upload-modal-store";
import { SECTION_HEADER_CLASS } from "./constants";

interface ColumnSlotPropertiesProps {
  blockId: string;
  columnIndex: number;
}

export function ColumnSlotProperties({ blockId, columnIndex }: ColumnSlotPropertiesProps) {
  const { addColumnChild, setColumnsSelection, getBlock } = useTemplateStore();
  const openImageUploadForColumn = useImageUploadModalStore((s) => s.openForColumnAdd);

  const block = getBlock(blockId);
  const n = block?.type === "columns" ? block.columnCount ?? 1 : 0;

  return (
    <>
      <h4 className={SECTION_HEADER_CLASS}>Column {columnIndex + 1}</h4>
      <p className="text-[10px] text-text-light/50 leading-relaxed mb-4">
        Add text, image, or button blocks into this column. They appear stacked top to bottom.
      </p>

      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={() =>
            addColumnChild(blockId, columnIndex, {
              type: "text",
              content: "New text",
              size: "medium",
              textStyle: "paragraph",
            })
          }
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-medium text-text-light/90 hover:bg-white/10 transition-colors"
        >
          <Type className="w-5 h-5 text-accent shrink-0" />
          Add text
        </button>
        <button
          type="button"
          onClick={() => openImageUploadForColumn(blockId, columnIndex)}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-medium text-text-light/90 hover:bg-white/10 transition-colors"
        >
          <ImageIcon className="w-5 h-5 text-accent shrink-0" />
          Add image
        </button>
        <button
          type="button"
          onClick={() =>
            addColumnChild(blockId, columnIndex, {
              type: "button",
              text: "Click Me",
              link: "#",
              backgroundColor: "#D65A31",
              textColor: "#ffffff",
            })
          }
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-medium text-text-light/90 hover:bg-white/10 transition-colors"
        >
          <MousePointer2 className="w-5 h-5 text-accent shrink-0" />
          Add button
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() =>
            setColumnsSelection({ kind: "columns-block", blockId })
          }
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Edit grid settings
        </button>
        {n > 1 && (
          <p className="text-[9px] text-text-light/40 mt-2">
            Tip: click another column on the canvas to switch target ({n} columns).
          </p>
        )}
      </div>
    </>
  );
}
