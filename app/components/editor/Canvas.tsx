"use client";

import React, { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useTemplateStore } from "@/lib/editor/template-store";
import { BlockPreview } from "./BlockPreview";
import type { MJMLBlock } from "@/lib/editor/block-types";

export const Canvas: React.FC = () => {
  const { blocks, activeBlockId, setActiveBlockId } = useTemplateStore();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

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
        className={`h-full bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-auto transition-all duration-500 border border-white/10 ${
          viewMode === "desktop" ? "w-full max-w-4xl" : "w-[375px]"
        }`}
      >
        {blocks.length === 0 ? (
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-[#666]">
              Add blocks from the sidebar to get started
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2 min-h-full">
            {blocks.map((block: MJMLBlock) => (
              <div
                key={block.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveBlockId(block.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveBlockId(block.id);
                  }
                }}
                className="rounded-lg min-h-[2rem] px-4 py-1"
                data-block-id={block.id}
              >
                <BlockPreview
                  block={block}
                  isSelected={activeBlockId === block.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
