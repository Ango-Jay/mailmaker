"use client";

import React, { useState } from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { useTemplateStore } from "@/lib/editor/template-store";
import { INPUT_CLASS, LABEL_CLASS, SECTION_HEADER_CLASS } from "./constants";

const GAP_PRESETS = ["8px", "12px", "16px", "24px", "32px"];

interface ColumnsBlockPropertiesProps {
  block: MJMLBlock;
}

export function ColumnsBlockProperties({ block }: ColumnsBlockPropertiesProps) {
  const { updateBlock, setColumnsSelection, activeBlockId } = useTemplateStore();
  const [countConfirm, setCountConfirm] = useState<1 | 2 | 3 | 4 | null>(null);

  if (block.type !== "columns" || !activeBlockId) return null;

  const n = block.columnCount ?? 1;
  const gap = block.columnGap ?? "16px";

  const handleGap = (v: string) => updateBlock(activeBlockId, { columnGap: v });

  const handleColumnCount = (next: 1 | 2 | 3 | 4) => {
    if (next === n) {
      setCountConfirm(null);
      return;
    }
    const slots = block.columnSlots ?? [];
    if (next < n) {
      const dropped = slots.slice(next);
      const wouldLose = dropped.some((s) => s.blocks.length > 0);
      if (wouldLose && countConfirm !== next) {
        setCountConfirm(next);
        return;
      }
    }
    setCountConfirm(null);
    useTemplateStore.getState().setColumnsBlockColumnCount(activeBlockId, next);
  };

  return (
    <>
      <h4 className={SECTION_HEADER_CLASS}>Columns layout</h4>
      <p className="text-[10px] text-text-light/50 leading-relaxed mb-3">
        Edit the whole grid: column count and spacing. Click a column on the canvas
        to add blocks there.
      </p>

      <div className="space-y-3">
        <div>
          <label className={LABEL_CLASS}>Number of columns</label>
          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleColumnCount(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  n === c
                    ? "bg-accent text-white"
                    : "bg-white/10 text-text-light/70 hover:bg-white/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {countConfirm !== null && (
            <div className="mt-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 space-y-2">
              <p className="text-[10px] text-amber-200/90">
                Reducing columns will remove content in the rightmost columns. Continue?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase text-red-400 hover:text-red-300"
                  onClick={() => {
                    useTemplateStore
                      .getState()
                      .setColumnsBlockColumnCount(activeBlockId, countConfirm);
                    setCountConfirm(null);
                  }}
                >
                  Yes, remove
                </button>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase text-text-light/60"
                  onClick={() => setCountConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className={LABEL_CLASS}>Padding between columns</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {GAP_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleGap(p)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                  gap === p
                    ? "bg-accent/80 text-white"
                    : "bg-white/10 text-text-light/60 hover:bg-white/15"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={gap}
            onChange={(e) => handleGap(e.target.value)}
            className={INPUT_CLASS}
            placeholder="16px"
          />
        </div>
      </div>

      <h4 className={`${SECTION_HEADER_CLASS} mt-6`}>Selection</h4>
      <button
        type="button"
        className="text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80"
        onClick={() =>
          setColumnsSelection({ kind: "column", blockId: block.id, columnIndex: 0 })
        }
      >
        Select column 1 to add blocks
      </button>
    </>
  );
}
