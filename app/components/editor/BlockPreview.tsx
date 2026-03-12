"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface BlockPreviewProps {
  block: MJMLBlock;
  isSelected?: boolean;
  className?: string;
}

/** Renders a single block as React for the sortable canvas (email-style preview). */
export const BlockPreview: React.FC<BlockPreviewProps> = ({
  block,
  isSelected,
  className = "",
}) => {
  const align = block.align ?? block.textAlign ?? "center";
  const color = block.textColor ?? block.color ?? "#333333";
  const fontSize =
    block.size === "large"
      ? "1.25rem"
      : block.size === "small"
        ? "0.875rem"
        : "1rem";

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  const wrapperClass = `block-preview ${alignClass} ${isSelected ? "ring-2 ring-[#D65A31] ring-offset-2 rounded" : ""} ${className}`.trim();

  switch (block.type) {
    case "text":
      return (
        <div className={wrapperClass}>
          <div
            className="py-2 px-4"
            style={{
              color,
              fontSize,
              fontWeight: block.bold ? 700 : undefined,
              fontStyle: block.italic ? "italic" : undefined,
              textDecoration: block.underline ? "underline" : undefined,
            }}
          >
            {block.content ?? block.text ?? ""}
          </div>
        </div>
      );

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
