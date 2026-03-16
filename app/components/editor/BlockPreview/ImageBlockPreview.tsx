"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";

interface ImageBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function ImageBlockPreview({ block, wrapperClass }: ImageBlockPreviewProps) {
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
}
