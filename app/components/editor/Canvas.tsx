"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useTemplateStore } from "@/lib/editor/template-store";
import { useLayoutStore } from "@/lib/editor/layout-store";
import { BlockPreview } from "./BlockPreview";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Editor PREVIEW canvas: shows blocks as React-rendered BlockPreview components.
 * This is for editing only. The GENERATED OUTPUT (email-friendly HTML from MJML)
 * is produced separately (e.g. Export HTML modal).
 */
export const Canvas: React.FC = () => {
  const {
    blocks,
    activeBlockId,
    selectTopLevelBlock,
    removeBlock,
    updateBlock,
  } = useTemplateStore();
  const {
    contentAreaWidth,
    contentAreaAlignment,
    backgroundColor,
    contentAreaBackgroundColor,
    backgroundImageEnabled,
    defaultFontFamily,
  } = useLayoutStore();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const contentWidthStyle = viewMode === "desktop" ? contentAreaWidth : "375px";
  const contentBgStyle =
    contentAreaBackgroundColor === "transparent"
      ? "transparent"
      : contentAreaBackgroundColor;
  const contentAlignStyle =
    contentAreaAlignment === "left"
      ? { marginRight: "auto", marginLeft: 0 }
      : contentAreaAlignment === "right"
        ? { marginLeft: "auto", marginRight: 0 }
        : { marginLeft: "auto", marginRight: "auto" };
  const pageBgStyle = backgroundImageEnabled
    ? { backgroundImage: "linear-gradient(135deg,#ffffff,#f2f2f2)" }
    : {};

  return (
    <div className="flex flex-col items-center w-full h-full gap-6">
      {/* Viewport Switcher */}
      <div className="flex w-fit rounded-lg border border-white/10 bg-white/5 overflow-hidden p-1">
        <button
          onClick={() => setViewMode("desktop")}
          className={`px-4 py-1.5 text-xs flex items-center gap-2 rounded-md transition-all ${
            viewMode === "desktop"
              ? "bg-accent text-white shadow-lg"
              : "text-text-light/40 hover:text-text-light hover:bg-white/5"
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="font-bold">Desktop</span>
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`px-4 py-1.5 text-xs flex items-center gap-2 rounded-md transition-all ${
            viewMode === "mobile"
              ? "bg-accent text-white shadow-lg"
              : "text-text-light/40 hover:text-text-light hover:bg-white/5"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="font-bold">Mobile</span>
        </button>
      </div>

      {/* Frame */}
      <div
        className={`h-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-auto transition-all duration-500 border border-white/10 ${
          viewMode === "desktop" ? "w-full" : "w-[375px]"
        }`}
        style={{ backgroundColor, ...pageBgStyle }}
      >
        {blocks.length === 0 ? (
          <div
            className="h-full min-h-[320px] flex flex-col items-center justify-center gap-3 p-8 text-center"
            style={{
              width: contentWidthStyle,
              backgroundColor: contentBgStyle,
              fontFamily: defaultFontFamily,
              ...contentAlignStyle,
            }}
          >
            <p className="text-sm text-[#666]">
              Add blocks from the sidebar to get started
            </p>
          </div>
        ) : (
          <div
            className="p-4 space-y-2 min-h-full"
            onClick={() => selectTopLevelBlock(null)}
            role="presentation"
            style={{
              width: contentWidthStyle,
              backgroundColor: contentBgStyle,
              fontFamily: defaultFontFamily,
              ...contentAlignStyle,
            }}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block: MJMLBlock) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  isSelected={activeBlockId === block.id}
                  onSelect={() => selectTopLevelBlock(block.id)}
                  onDelete={() => removeBlock(block.id)}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
};

interface SortableBlockProps {
  block: MJMLBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
}) => {
  const isColumns = block.type === "columns";
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({
      id: block.id,
    });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative group rounded-lg min-h-[2rem] px-4 py-1 ${
        isColumns ? "" : "cursor-move"
      }`}
      data-block-id={block.id}
      {...attributes}
      {...(!isColumns ? listeners : {})}
    >
      {isColumns && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...listeners}
          className="mb-1 w-full cursor-grab active:cursor-grabbing rounded-md border border-white/10 bg-white/5 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-text-light/40 hover:bg-white/10 hover:text-text-light/60"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder columns block"
        >
          ⋮⋮ Drag row
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-red-500/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition-opacity"
        aria-label="Delete block"
        title="Delete block"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <BlockPreview
        block={block}
        isSelected={isSelected}
        onBlockUpdate={onUpdate}
        onFocusBlock={onSelect}
      />
    </div>
  );
};

