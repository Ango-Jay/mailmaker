"use client";

import React from "react";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { ColorPicker } from "@/app/components/ui/ColorPicker";
import { INPUT_CLASS, LABEL_CLASS } from "./constants";

interface TextBlockPropertiesProps {
  block: MJMLBlock;
  onUpdate: (updates: Partial<MJMLBlock>) => void;
}

export function TextBlockProperties({ block, onUpdate }: TextBlockPropertiesProps) {
  const handleChange = (updates: Partial<MJMLBlock>) => onUpdate(updates);

  return (
    <>
      <div className="space-y-2">
        <label className={LABEL_CLASS}>Content</label>
        <textarea
          value={block.content ?? block.text ?? ""}
          onChange={(e) =>
            handleChange({ content: e.target.value, text: e.target.value })
          }
          className={`${INPUT_CLASS} min-h-[80px]`}
          placeholder="Enter your text…"
        />
      </div>

      <div className="space-y-2">
        <label className={LABEL_CLASS}>Text type</label>
        <select
          value={block.textStyle ?? "paragraph"}
          onChange={(e) =>
            handleChange({
              textStyle: e.target.value as "h1" | "h2" | "h3" | "paragraph",
            })
          }
          className={INPUT_CLASS}
        >
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="paragraph">Paragraph</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className={LABEL_CLASS}>Formatting</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "bold", icon: Bold, label: "Bold" },
              { key: "italic", icon: Italic, label: "Italic" },
              { key: "underline", icon: Underline, label: "Underline" },
              { key: "strikethrough", icon: Strikethrough, label: "Strikethrough" },
            ] as const
          ).map(({ key, icon: Icon, label }) => {
            const formatKey: "bold" | "italic" | "underline" | "strikethrough" = key;
            const checked = !!block[formatKey];
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleChange({ [key]: !checked } as Partial<MJMLBlock>)}
                className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors ${
                  checked
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-white/10 bg-white/5 text-text-light/80 hover:border-accent/70 hover:bg-white/10"
                }`}
                title={label}
                aria-label={label}
                aria-pressed={checked}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-text-light/50">Align</label>
            <select
              value={block.align ?? block.textAlign ?? "center"}
              onChange={(e) =>
                handleChange({
                  align: e.target.value as "left" | "center" | "right",
                  textAlign: e.target.value as "left" | "center" | "right",
                })
              }
              className={INPUT_CLASS}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-semibold text-text-light/50">Transform</label>
            <select
              value={block.textTransform ?? "none"}
              onChange={(e) =>
                handleChange({
                  textTransform: e.target.value as
                    | "none"
                    | "uppercase"
                    | "lowercase"
                    | "capitalize",
                })
              }
              className={INPUT_CLASS}
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={LABEL_CLASS}>List</label>
        <select
          value={block.listType ?? "none"}
          onChange={(e) =>
            handleChange({
              listType: e.target.value as "none" | "bullet" | "numbered",
            })
          }
          className={INPUT_CLASS}
        >
          <option value="none">None</option>
          <option value="bullet">Bullet list</option>
          <option value="numbered">Numbered list</option>
        </select>
        {(block.listType === "bullet" || block.listType === "numbered") && (
          <textarea
            value={(block.listItems ?? []).join("\n")}
            onChange={(e) =>
              handleChange({
                listItems: e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder={"Item 1\nItem 2\nItem 3"}
            className={`${INPUT_CLASS} min-h-[60px] text-xs`}
          />
        )}
      </div>

      <div className="space-y-3">
        <p className={LABEL_CLASS}>Colors</p>
        <ColorPicker
          label="Text color"
          value={block.textColor ?? block.color ?? "#333333"}
          onChange={(v) => handleChange({ textColor: v, color: v })}
          id="text-block-text-color"
        />
        <ColorPicker
          label="Background color"
          value={block.backgroundColor ?? "#ffffff"}
          onChange={(v) => handleChange({ backgroundColor: v })}
          id="text-block-bg-color"
        />
      </div>
    </>
  );
}
