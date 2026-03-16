"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface CardBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function CardBlockPreview({ block, wrapperClass }: CardBlockPreviewProps) {
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
      {block.title && <div className="font-bold text-lg mb-1">{block.title}</div>}
      {block.subtitle && (
        <div className="text-sm opacity-80 mb-1">{block.subtitle}</div>
      )}
      {block.description && (
        <div className="text-sm leading-relaxed mb-3">{block.description}</div>
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
}
