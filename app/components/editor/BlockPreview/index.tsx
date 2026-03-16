"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { getAlign, getColor, getWrapperClass, getTextBlockStyle } from "./shared";
import { TextBlockPreview } from "./TextBlockPreview";
import { ButtonBlockPreview } from "./ButtonBlockPreview";
import { ImageBlockPreview } from "./ImageBlockPreview";
import { SpacerBlockPreview } from "./SpacerBlockPreview";
import { DividerBlockPreview } from "./DividerBlockPreview";
import { CardBlockPreview } from "./CardBlockPreview";
import { FooterBlockPreview } from "./FooterBlockPreview";

export interface BlockPreviewProps {
  block: MJMLBlock;
  isSelected?: boolean;
  className?: string;
  onBlockUpdate?: (updates: Partial<MJMLBlock>) => void;
  onFocusBlock?: () => void;
}

/**
 * Editor PREVIEW: renders one block as React for the canvas.
 * Not the generated email HTML; visual approximation for editing.
 * Actual email output: blocksToGeneratedMjml → mjml2html.
 */
export const BlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected = false,
  className = "",
  onBlockUpdate,
  onFocusBlock,
}) => {
  const align = getAlign(block);
  const color = getColor(block);
  const wrapperClass = getWrapperClass(align, isSelected, className);

  switch (block.type) {
    case "text":
      return (
        <TextBlockPreview
          block={block}
          wrapperClass={wrapperClass}
          style={getTextBlockStyle(block, align, color)}
          onBlockUpdate={onBlockUpdate}
          onFocusBlock={onFocusBlock}
        />
      );
    case "button":
      return <ButtonBlockPreview block={block} wrapperClass={wrapperClass} />;
    case "image":
      return <ImageBlockPreview block={block} wrapperClass={wrapperClass} />;
    case "spacer":
      return <SpacerBlockPreview block={block} wrapperClass={wrapperClass} />;
    case "divider":
      return <DividerBlockPreview block={block} wrapperClass={wrapperClass} />;
    case "card":
      return <CardBlockPreview block={block} wrapperClass={wrapperClass} />;
    case "footer":
      return <FooterBlockPreview block={block} wrapperClass={wrapperClass} />;
    default:
      return (
        <div className={wrapperClass}>
          <div className="py-2 text-sm" style={{ color }}>
            {String((block as MJMLBlock).content ?? "")}
          </div>
        </div>
      );
  }
};
