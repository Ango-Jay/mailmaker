"use client";

import React from "react";
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

export const PropertyEditor: React.FC = () => {
  const { activeBlockId, getBlock, updateBlock, removeBlock } =
    useTemplateStore();
  const openImageUploadModal = useImageUploadModalStore((s) => s.openForEdit);

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

  const handleChange = (updates: Partial<MJMLBlock>) => {
    updateBlock(activeBlockId, updates);
  };

  const blockLabel = (type: BlockType) =>
    type.charAt(0).toUpperCase() + type.slice(1);

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
