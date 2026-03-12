"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Copy, Download } from "lucide-react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { blocksToGeneratedMjml } from "@/lib/editor/blocks-to-mjml";
import { ResponsiveModal } from "@/app/components/ui/Modal";

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: MJMLBlock[];
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({
  isOpen,
  onClose,
  blocks,
}) => {
  const [exportHtml, setExportHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setExportHtml(null);
    let cancelled = false;
    (async () => {
      try {
        const mjml = blocksToGeneratedMjml(blocks);
        const mjml2html = (await import("mjml-browser")).default;
        const { html } = mjml2html(mjml);
        if (!cancelled) setExportHtml(html);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to compile HTML");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, blocks]);

  const handleCopy = useCallback(async () => {
    if (!exportHtml) return;
    try {
      await navigator.clipboard.writeText(exportHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed");
    }
  }, [exportHtml]);

  const handleDownload = useCallback(() => {
    if (!exportHtml) return;
    const blob = new Blob([exportHtml], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportHtml]);

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export HTML"
      width={720}
      height="80vh"
    >
      <div className="flex flex-col gap-4 h-full min-h-0 pb-4">
        {loading && (
          <p className="text-sm text-text-light/60">
            Compiling MJML to email-friendly HTML…
          </p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && exportHtml && (
          <>
            <textarea
              readOnly
              value={exportHtml}
              className="flex-1 w-full min-h-[200px] bg-[#1a1c1e] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-text-light overflow-auto focus:outline-none"
              spellCheck={false}
            />
            <div className="w-full flex items-center justify-center flex-wrap gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-bold transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-sm font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                Download as file
              </button>
            </div>
          </>
        )}
      </div>
    </ResponsiveModal>
  );
};
