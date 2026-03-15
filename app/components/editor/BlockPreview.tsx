"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface BlockPreviewProps {
  block: MJMLBlock;
  isSelected?: boolean;
  className?: string;
  /** Called when a block's content should be updated (e.g. text block textarea). */
  onBlockUpdate?: (updates: Partial<MJMLBlock>) => void;
  /** Called when a focusable part of the block is focused (e.g. to select the block). */
  onFocusBlock?: () => void;
}

/**
 * Editor PREVIEW: renders one block as React for the canvas.
 * This is not the generated email HTML; it’s a visual approximation for editing.
 * The actual email output comes from MJML (blocksToGeneratedMjml → mjml2html).
 */
export const BlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  className = "",
  onBlockUpdate,
  onFocusBlock,
}) => {
  const align = block.align ?? block.textAlign ?? "center";
  const color = block.textColor ?? block.color ?? "#333333";
  const textStyle = block.textStyle ?? (block.size === "large" ? "h1" : block.size === "small" ? "h3" : "paragraph");
  const fontSize =
    textStyle === "h1"
      ? "1.75rem"
      : textStyle === "h2"
        ? "1.375rem"
        : textStyle === "h3"
          ? "1.125rem"
          : block.size === "large"
            ? "1.25rem"
            : block.size === "small"
              ? "0.875rem"
              : "1rem";
  const fontWeight = textStyle === "h1" || textStyle === "h2" || textStyle === "h3" ? 700 : undefined;

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  const wrapperClass = `block-preview ${alignClass} ${isSelected ? "ring-2 ring-[#D65A31] ring-offset-2 rounded" : ""} ${className}`.trim();

  switch (block.type) {
    case "text": {
      const listType = block.listType ?? "none";
      const isList = listType === "bullet" || listType === "numbered";
      const rawContent = block.content ?? block.text ?? "";
      const listItems = block.listItems ?? [];
      const textDeco = [
        block.underline ? "underline" : "",
        block.strikethrough ? "line-through" : "",
      ].filter(Boolean).join(" ");
      const style: React.CSSProperties = {
        color,
        fontSize,
        fontWeight: block.bold ? 700 : fontWeight,
        fontStyle: block.italic ? "italic" : undefined,
        textDecoration: textDeco || undefined,
        textTransform: block.textTransform && block.textTransform !== "none" ? block.textTransform : undefined,
        textAlign: align === "left" ? "left" : align === "right" ? "right" : "center",
      };

      if (isList) {
        const items = listItems.length > 0 ? listItems : [""];
        const updateItem = (index: number, text: string) => {
          const next = [...items];
          next[index] = text;
          onBlockUpdate?.({ listItems: next });
        };
        const addItem = () => onBlockUpdate?.({ listItems: [...items, ""] });
        const removeItem = (index: number) => {
          const next = items.filter((_, i) => i !== index);
          onBlockUpdate?.({ listItems: next.length > 0 ? next : [""] });
        };
        const ListTag = listType === "numbered" ? "ol" : "ul";
        return (
          <div
            className={wrapperClass}
            style={
              block.backgroundColor
                ? { backgroundColor: block.backgroundColor, borderRadius: 8 }
                : undefined
            }
          >
            <div className="py-2 px-4" style={style}>
              <ListTag className={listType === "numbered" ? "list-decimal" : "list-disc"} style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 py-0.5">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem(i, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={onFocusBlock}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-0 p-0 text-inherit"
                      style={{ textTransform: style.textTransform }}
                      placeholder="List item"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                        className="flex-shrink-0 text-red-500/80 hover:text-red-500 text-xs"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ListTag>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); addItem(); }}
                className="mt-1 text-xs text-accent hover:underline"
              >
                + Add item
              </button>
            </div>
          </div>
        );
      }

      return (
        <div
          className={wrapperClass}
          style={
            block.backgroundColor
              ? { backgroundColor: block.backgroundColor, borderRadius: 8 }
              : undefined
          }
        >
          <div className="py-2 px-4" style={style}>
            <textarea
              value={rawContent}
              onChange={(e) =>
                onBlockUpdate?.({ content: e.target.value, text: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
              onFocus={onFocusBlock}
              className="w-full min-h-[1.5rem] resize-y bg-transparent border-none outline-none focus:ring-0 p-0"
              style={{ textAlign: style.textAlign, textTransform: style.textTransform }}
              placeholder="Enter your text…"
              rows={Math.max(1, rawContent.split(/\n/).length)}
            />
          </div>
        </div>
      );
    }

    case "button":
      return (
        <div className={`${wrapperClass} py-3`}>
          <span
            className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold"
            style={{
              backgroundColor: block.backgroundColor ?? "#D65A31",
              color: block.textColor ?? block.color ?? "#ffffff",
            }}
          >
            {block.text ?? block.content ?? "Button"}
          </span>
        </div>
      );

    case "image":
      return (
        <div className={wrapperClass}>
          <div className="py-2">
            {block.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.src}
                alt={block.alt ?? ""}
                className="max-w-full h-auto rounded-lg"
                style={{ width: block.width ?? "100%" }}
              />
            ) : (
              <div
                className="rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs"
                style={{ minHeight: 120, width: block.width ?? "100%" }}
              >
                Image
              </div>
            )}
          </div>
        </div>
      );

    case "spacer":
      return (
        <div
          className={wrapperClass}
          style={{ height: block.height ?? "20px" }}
          aria-hidden
        />
      );

    case "card":
      return (
        <div
          className={wrapperClass}
          style={{
            backgroundColor: block.backgroundColor ?? "#f5f5f5",
            color: block.textColor ?? block.color ?? "#333",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
          }}
        >
          {block.title && (
            <div className="font-bold text-lg mb-1">{block.title}</div>
          )}
          {block.subtitle && (
            <div className="text-sm opacity-80 mb-1">{block.subtitle}</div>
          )}
          {block.description && (
            <div className="text-sm leading-relaxed mb-3">
              {block.description}
            </div>
          )}
          {block.ctaText && (
            <span
              className="inline-block rounded-full px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: "#222", color: "#fff" }}
            >
              {block.ctaText}
            </span>
          )}
        </div>
      );

    case "footer":
      return (
        <div
          className={`${wrapperClass} py-4 text-xs`}
          style={{ color: "#888" }}
        >
          {block.mutedText ?? `© ${block.year ?? new Date().getFullYear()} ${block.brand ?? ""}`}
        </div>
      );

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
