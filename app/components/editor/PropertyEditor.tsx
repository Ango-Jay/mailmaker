"use client";

import React from "react";
import { useEditorStore } from "@/lib/editor/store";
import { findElementById } from "@/lib/editor/helpers";

export const PropertyEditor: React.FC = () => {
  const {
    activeElementId,
    template,
    updateElementAttributes,
    updateElementContent,
    removeElement,
  } = useEditorStore();

  const activeElement = activeElementId
    ? findElementById(template, activeElementId)
    : null;

  if (!activeElementId || !activeElement) {
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
            Select an element on the canvas to edit its properties.
          </p>
        </div>
      </div>
    );
  }

  const handleAttrChange = (key: string, value: string) => {
    updateElementAttributes(activeElementId, { [key]: value });
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          Properties ({activeElement.type})
        </h3>
        <button
          onClick={() => removeElement(activeElementId)}
          className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="space-y-6">
        {/* Content Field (if applicable) */}
        {(activeElement.type === "mj-text" ||
          activeElement.type === "mj-button") && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-light/40 uppercase">
              Content
            </label>
            <textarea
              value={activeElement.content || ""}
              onChange={(e) =>
                updateElementContent(activeElementId, e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent min-h-[80px]"
            />
          </div>
        )}

        {/* Common Attributes */}
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-text-light/20 uppercase border-b border-white/5 pb-2">
            Styles
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-light/40 uppercase">
                Color
              </label>
              <input
                type="color"
                value={activeElement.attributes?.["color"] || "#000000"}
                onChange={(e) => handleAttrChange("color", e.target.value)}
                className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
              />
            </div>
            {activeElement.type === "mj-button" && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-light/40 uppercase">
                  BG Color
                </label>
                <input
                  type="color"
                  value={
                    activeElement.attributes?.["background-color"] || "#D65A31"
                  }
                  onChange={(e) =>
                    handleAttrChange("background-color", e.target.value)
                  }
                  className="w-full h-8 bg-transparent border-none rounded cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-light/40 uppercase">
              Font Size
            </label>
            <select
              value={activeElement.attributes?.["font-size"] || "13px"}
              onChange={(e) => handleAttrChange("font-size", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent"
            >
              {[10, 12, 13, 14, 16, 18, 20, 24, 32].map((size) => (
                <option key={size} value={`${size}px`}>
                  {size}px
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-light/40 uppercase">
              Padding
            </label>
            <input
              type="text"
              value={activeElement.attributes?.["padding"] || "10px 25px"}
              onChange={(e) => handleAttrChange("padding", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
