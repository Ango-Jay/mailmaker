"use client";

import React, { useState, useEffect } from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { getAlign } from "./shared";

interface ImageBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function ImageBlockPreview({ block, wrapperClass }: ImageBlockPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (block.src) {
      setLoading(true);
      setError(false);
    }
  }, [block.src]);
  const align = getAlign(block);
  const width = block.width ?? "100%";
  const height = block.height;
  const borderRadius = block.borderRadius ?? "0";
  const imageWrapperClass =
    align === "left"
      ? "flex justify-start"
      : align === "right"
        ? "flex justify-end"
        : "flex justify-center";

  return (
    <div className={wrapperClass}>
      <div className={`py-2 ${imageWrapperClass}`}>
        {block.src ? (
          <div className="relative w-full" style={{ maxWidth: width }}>
            {loading && !error && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg text-white/40 text-xs"
                style={{ minHeight: 80 }}
              >
                Loading…
              </div>
            )}
            {error && (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-red-500/50 bg-red-500/10 text-red-400 text-xs py-6 px-4"
                style={{ minHeight: 120, width, borderRadius }}
              >
                <span>Image failed to load</span>
                <span className="text-white/60 truncate max-w-full">{block.src}</span>
              </div>
            )}
            {!error && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.src}
                alt={block.alt ?? ""}
                className="max-w-full h-auto block"
                style={{
                  width,
                  height: height || undefined,
                  borderRadius,
                  opacity: loading ? 0 : 1,
                }}
                onLoad={() => {
                  setLoading(false);
                  setError(false);
                }}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
              />
            )}
          </div>
        ) : (
          <div
            className="rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs"
            style={{ minHeight: 120, width: block.width ?? "100%" }}
          >
            Image
          </div>
        )}
      </div>
      {block.caption && (
        <p className="text-xs text-white/60 text-center mt-1 px-2" style={{ textAlign: align }}>
          {block.caption}
        </p>
      )}
    </div>
  );
}
