"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { getTextBlockStyle } from "./shared";

interface TextBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
  style: React.CSSProperties;
  onBlockUpdate?: (updates: Partial<MJMLBlock>) => void;
  onFocusBlock?: () => void;
}

export function TextBlockPreview({
  block,
  wrapperClass,
  style,
  onBlockUpdate,
  onFocusBlock,
}: TextBlockPreviewProps) {
  const listType = block.listType ?? "none";
  const isList = listType === "bullet" || listType === "numbered";
  const rawContent = block.content ?? block.text ?? "";
  const listItems = block.listItems ?? [];

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
          <ListTag
            className={listType === "numbered" ? "list-decimal" : "list-disc"}
            style={{ margin: 0, paddingLeft: "1.25rem" }}
          >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(i);
                    }}
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
            onClick={(e) => {
              e.stopPropagation();
              addItem();
            }}
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
