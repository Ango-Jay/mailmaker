"use client";

import React from "react";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { useTemplateStore } from "@/lib/editor/template-store";
import type { MJMLBlock, BlockType } from "@/lib/editor/block-types";
import { useImageUploadModalStore } from "@/lib/editor/image-upload-modal-store";
import { TextBlockProperties } from "./TextBlockProperties";
import { ButtonBlockProperties } from "./ButtonBlockProperties";
import { ImageBlockProperties } from "./ImageBlockProperties";
import { SpacerBlockProperties } from "./SpacerBlockProperties";
import { DividerBlockProperties } from "./DividerBlockProperties";
import { CardBlockProperties } from "./CardBlockProperties";
import { FooterBlockProperties } from "./FooterBlockProperties";
import { HtmlBlockProperties } from "./HtmlBlockProperties";
import { ColumnsBlockProperties } from "./ColumnsBlockProperties";
import { ColumnSlotProperties } from "./ColumnSlotProperties";
import { INPUT_CLASS, LABEL_CLASS, SECTION_HEADER_CLASS } from "./constants";

function MjmlBlockProperties({
  block,
  onUpdate,
}: {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <h4 className={SECTION_HEADER_CLASS}>Main</h4>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>MJML</label>
        <textarea
          value={block.content ?? ""}
          onChange={(e) => handleChange({ content: e.target.value })}
          className={`${INPUT_CLASS} min-h-[220px] font-mono text-[11px]`}
          placeholder="Paste MJML here"
          spellCheck={false}
        />
      </div>

      <h4 className={SECTION_HEADER_CLASS}>Others</h4>
      <p className="text-[10px] text-text-light/50 leading-relaxed">
        Custom MJML is sanitized lightly (scripts/styles removed). You are
        responsible for producing valid MJML.
      </p>
    </>
  );
}

export const PropertyEditor: React.FC = () => {
  const {
    activeBlockId,
    getBlock,
    updateBlock,
    removeBlock,
    columnsSelection,
    setColumnsSelection,
    updateColumnChild,
    removeColumnChild,
  } = useTemplateStore();
  const openImageUploadModal = useImageUploadModalStore((s) => s.openForEdit);
  const openForEditColumnImage = useImageUploadModalStore(
    (s) => s.openForEditColumnImage,
  );

  const activeBlock = activeBlockId ? getBlock(activeBlockId) : null;

  if (!activeBlockId || !activeBlock) {
    return (
      <div className="p-6 h-full flex flex-col">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-8">
          Properties
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <span className="text-xl">✨</span>
          </div>
          <p className="text-xs text-text-light/40 leading-relaxed">
            Select a block on the canvas to edit its properties.
          </p>
        </div>
      </div>
    );
  }

  const blockLabel = (type: BlockType) =>
    type === "columns" ? "Columns" : type.charAt(0).toUpperCase() + type.slice(1);

  /** Columns block: nested selection (A / B / C). */
  if (activeBlock.type === "columns") {
    const sel =
      columnsSelection?.blockId === activeBlock.id ? columnsSelection : null;

    if (!sel || sel.kind === "columns-block") {

      return (
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Properties (Grid)
            </h3>
            <button
              type="button"
              onClick={() => removeBlock(activeBlockId)}
              className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
            >
              Delete
            </button>
          </div>
          <div className="space-y-6">
            <ColumnsBlockProperties block={activeBlock} />
          </div>
        </div>
      );
    }

    if (sel.kind === "column") {
      return (
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Properties (Column {sel.columnIndex + 1})
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              setColumnsSelection({ kind: "columns-block", blockId: activeBlock.id })
            }
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-light/50 hover:text-accent mb-6"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to grid
          </button>
          <div className="space-y-6">
            <ColumnSlotProperties blockId={activeBlock.id} columnIndex={sel.columnIndex} />
          </div>
        </div>
      );
    }

    if (sel.kind === "column-child") {
      const slot = activeBlock.columnSlots?.[sel.columnIndex];
      const child = slot?.blocks.find((c) => c.id === sel.childId);
      if (!child) {
        return (
          <div className="p-6 text-xs text-text-light/50">
            Block not found.{" "}
            <button
              type="button"
              className="text-accent underline"
              onClick={() =>
                setColumnsSelection({
                  kind: "columns-block",
                  blockId: activeBlock.id,
                })
              }
            >
              Back to grid
            </button>
          </div>
        );
      }

      const onChildUpdate = (updates: Partial<MJMLBlock>) => {
        updateColumnChild(activeBlock.id, sel.columnIndex, child.id, updates);
      };

      const headerTitle =
        child.type === "text"
          ? "Text (in column)"
          : child.type === "image"
            ? "Image (in column)"
            : child.type === "button"
              ? "Button (in column)"
              : blockLabel(child.type);

      let inner: React.ReactNode = null;
      switch (child.type) {
        case "text":
          inner = <TextBlockProperties block={child} onUpdate={onChildUpdate} />;
          break;
        case "button":
          inner = <ButtonBlockProperties block={child} onUpdate={onChildUpdate} />;
          break;
        case "image":
          inner = (
            <ImageBlockProperties
              block={child}
              onUpdate={onChildUpdate}
              onOpenUploadModal={() =>
                openForEditColumnImage({
                  columnsBlockId: activeBlock.id,
                  columnIndex: sel.columnIndex,
                  childId: child.id,
                })
              }
            />
          );
          break;
        default:
          inner = (
            <p className="text-xs text-text-light/50">
              This block type can&apos;t be edited inside a column.
            </p>
          );
      }

      return (
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              {headerTitle}
            </h3>
            <button
              type="button"
              onClick={() =>
                removeColumnChild(activeBlock.id, sel.columnIndex, child.id)
              }
              className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
            >
              Delete
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() =>
                setColumnsSelection({
                  kind: "column",
                  blockId: activeBlock.id,
                  columnIndex: sel.columnIndex,
                })
              }
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-light/45 hover:text-accent"
            >
              <ChevronLeft className="w-3 h-3" />
              Column {sel.columnIndex + 1}
            </button>
            <span className="text-text-light/25">·</span>
            <button
              type="button"
              onClick={() =>
                setColumnsSelection({
                  kind: "columns-block",
                  blockId: activeBlock.id,
                })
              }
              className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-light/45 hover:text-accent"
            >
              <LayoutGrid className="w-3 h-3" />
              Grid
            </button>
          </div>
          <div className="space-y-6">{inner}</div>
        </div>
      );
    }
  }

  const handleChange = (updates: Partial<MJMLBlock>) => {
    updateBlock(activeBlockId, updates);
  };

  const renderBlockProperties = () => {
    switch (activeBlock.type) {
      case "text":
        return (
          <TextBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      case "button":
        return (
          <ButtonBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      case "image":
        return (
          <ImageBlockProperties
            block={activeBlock}
            onUpdate={handleChange}
            onOpenUploadModal={openImageUploadModal}
          />
        );
      case "spacer":
        return (
          <SpacerBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      case "divider":
        return (
          <DividerBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      case "html":
        return <HtmlBlockProperties block={activeBlock} onUpdate={handleChange} />;
      case "mjml":
        return <MjmlBlockProperties block={activeBlock} onUpdate={handleChange} />;
      case "card":
        return (
          <CardBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      case "footer":
        return (
          <FooterBlockProperties block={activeBlock} onUpdate={handleChange} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Properties ({blockLabel(activeBlock.type)})
        </h3>
        <button
          type="button"
          onClick={() => removeBlock(activeBlockId)}
          className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="space-y-6">{renderBlockProperties()}</div>
    </div>
  );
};
