"use client";

import React from "react";
import { useTemplateStore } from "@/lib/editor/template-store";
import type { MJMLBlock, BlockType } from "@/lib/editor/block-types";

const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent";
const LABEL_CLASS = "text-[10px] font-bold text-text-light/40 uppercase";

function parseValueWithUnit(val: string): { num: number; unit: string } {
  const match = String(val ?? "").trim().match(/^(-?\d*(?:\.\d+)?)(px|%|em|rem)?$/i);
  if (!match) return { num: 0, unit: "px" };
  return {
    num: parseFloat(match[1]) || 0,
    unit: (match[2] || "px").toLowerCase(),
  };
}

function StepperInput({
  value,
  onChange,
  step = 4,
  min = 0,
  max,
  unit = "px",
}: {
  value: string;
  onChange: (next: string) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const { num, unit: parsedUnit } = parseValueWithUnit(value);
  const u = parsedUnit || unit;

  const apply = (n: number) => {
    const clamped = max != null ? Math.min(max, n) : n;
    const next = Math.max(min, clamped);
    onChange(`${next}${u}`);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => apply(num - step)}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent flex items-center justify-center text-sm font-bold transition-colors"
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} flex-1 text-center font-mono`}
      />
      <button
        type="button"
        onClick={() => apply(num + step)}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent flex items-center justify-center text-sm font-bold transition-colors"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export const PropertyEditor: React.FC = () => {
  const { activeBlockId, getBlock, updateBlock, removeBlock } =
    useTemplateStore();

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

      <div className="space-y-6">
        {/* Text (heading and paragraph) */}
        {activeBlock.type === "text" && (
          <>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Content</label>
              <textarea
                value={activeBlock.content ?? activeBlock.text ?? ""}
                onChange={(e) =>
                  handleChange({ content: e.target.value, text: e.target.value })
                }
                className={`${INPUT_CLASS} min-h-[80px]`}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Size</label>
              <select
                value={activeBlock.size ?? "medium"}
                onChange={(e) =>
                  handleChange({
                    size: e.target.value as "large" | "medium" | "small",
                  })
                }
                className={INPUT_CLASS}
              >
                {(["small", "medium", "large"] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["bold", "italic", "underline"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={!!activeBlock[key]}
                    onChange={(e) => handleChange({ [key]: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                  />
                  {key}
                </label>
              ))}
            </div>
          </>
        )}

        {/* Button */}
        {activeBlock.type === "button" && (
          <>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Text</label>
              <input
                type="text"
                value={activeBlock.text ?? ""}
                onChange={(e) => handleChange({ text: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Link</label>
              <input
                type="url"
                value={activeBlock.link ?? ""}
                onChange={(e) => handleChange({ link: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Text Color</label>
                <input
                  type="color"
                  value={activeBlock.textColor ?? activeBlock.color ?? "#ffffff"}
                  onChange={(e) =>
                    handleChange({ textColor: e.target.value, color: e.target.value })
                  }
                  className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Background</label>
                <input
                  type="color"
                  value={activeBlock.backgroundColor ?? "#D65A31"}
                  onChange={(e) =>
                    handleChange({ backgroundColor: e.target.value })
                  }
                  className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
                />
              </div>
            </div>
          </>
        )}

        {/* Image */}
        {activeBlock.type === "image" && (
          <>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Image URL</label>
              <input
                type="url"
                value={activeBlock.src ?? ""}
                onChange={(e) => handleChange({ src: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Alt text</label>
              <input
                type="text"
                value={activeBlock.alt ?? ""}
                onChange={(e) => handleChange({ alt: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Width</label>
              <StepperInput
                value={activeBlock.width ?? "100%"}
                onChange={(v) => handleChange({ width: v })}
                step={parseValueWithUnit(activeBlock.width ?? "100%").unit === "%" ? 5 : 10}
                min={parseValueWithUnit(activeBlock.width ?? "100%").unit === "%" ? 5 : 1}
                max={parseValueWithUnit(activeBlock.width ?? "100%").unit === "%" ? 100 : undefined}
              />
            </div>
          </>
        )}

        {/* Spacer */}
        {activeBlock.type === "spacer" && (
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Height</label>
            <StepperInput
              value={activeBlock.height ?? "20px"}
              onChange={(v) => handleChange({ height: v })}
              step={4}
              min={2}
            />
          </div>
        )}

        {/* Card */}
        {activeBlock.type === "card" && (
          <>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Variant</label>
              <select
                value={activeBlock.variant ?? "default"}
                onChange={(e) =>
                  handleChange({
                    variant: e.target.value as MJMLBlock["variant"],
                  })
                }
                className={INPUT_CLASS}
              >
                {(["default", "minimal", "feature", "pricing", "product"] as const).map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Title</label>
              <input
                type="text"
                value={activeBlock.title ?? ""}
                onChange={(e) => handleChange({ title: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Subtitle</label>
              <input
                type="text"
                value={activeBlock.subtitle ?? ""}
                onChange={(e) => handleChange({ subtitle: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Description</label>
              <textarea
                value={activeBlock.description ?? ""}
                onChange={(e) => handleChange({ description: e.target.value })}
                className={`${INPUT_CLASS} min-h-[60px]`}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Button text</label>
              <input
                type="text"
                value={activeBlock.ctaText ?? ""}
                onChange={(e) => handleChange({ ctaText: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Button link</label>
              <input
                type="url"
                value={activeBlock.link ?? ""}
                onChange={(e) => handleChange({ link: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Background</label>
                <input
                  type="color"
                  value={activeBlock.backgroundColor ?? "#ffffff"}
                  onChange={(e) =>
                    handleChange({ backgroundColor: e.target.value })
                  }
                  className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <label className={LABEL_CLASS}>Text color</label>
                <input
                  type="color"
                  value={activeBlock.textColor ?? activeBlock.color ?? "#333333"}
                  onChange={(e) =>
                    handleChange({
                      textColor: e.target.value,
                      color: e.target.value,
                    })
                  }
                  className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
                />
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        {activeBlock.type === "footer" && (
          <>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Brand</label>
              <input
                type="text"
                value={activeBlock.brand ?? ""}
                onChange={(e) => handleChange({ brand: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Year</label>
              <input
                type="text"
                value={activeBlock.year ?? ""}
                onChange={(e) => handleChange({ year: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Muted text</label>
              <textarea
                value={activeBlock.mutedText ?? ""}
                onChange={(e) => handleChange({ mutedText: e.target.value })}
                className={`${INPUT_CLASS} min-h-[60px]`}
              />
            </div>
          </>
        )}

        {/* Shared: align for text/button */}
        {(activeBlock.type === "text" || activeBlock.type === "button") && (
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Align</label>
            <select
              value={activeBlock.align ?? activeBlock.textAlign ?? "center"}
              onChange={(e) =>
                handleChange({
                  align: e.target.value as "left" | "center" | "right",
                  textAlign: e.target.value as "left" | "center" | "right",
                })
              }
              className={INPUT_CLASS}
            >
              {(["left", "center", "right"] as const).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Text color for text block */}
        {activeBlock.type === "text" && (
          <div className="space-y-2">
            <label className={LABEL_CLASS}>Text color</label>
            <input
              type="color"
              value={activeBlock.textColor ?? activeBlock.color ?? "#333333"}
              onChange={(e) =>
                handleChange({
                  textColor: e.target.value,
                  color: e.target.value,
                })
              }
              className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
