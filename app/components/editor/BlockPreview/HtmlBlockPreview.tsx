"use client";

import React from "react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { sanitizeHtmlBlock } from "@/lib/editor/helpers";

interface HtmlBlockPreviewProps {
  block: MJMLBlock;
  wrapperClass: string;
}

export function HtmlBlockPreview({ block, wrapperClass }: HtmlBlockPreviewProps) {
  const raw = block.content ?? "";
  const sanitized = raw ? sanitizeHtmlBlock(raw) : "";

  return (
    <div className={`${wrapperClass} py-3`}>
      {sanitized ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] overflow-auto">
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-white/5 px-3 py-6 text-[11px] text-text-light/50 text-center">
          Custom HTML block (no content)
        </div>
      )}
    </div>
  );
}

