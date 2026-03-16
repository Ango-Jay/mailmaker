"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Copy, Download } from "lucide-react";
import type { MJMLBlock } from "@/lib/editor/block-types";
import { blocksToGeneratedMjml } from "@/lib/editor/blocks-to-mjml";
import { ResponsiveModal } from "@/app/components/ui/Modal";

type ExportTab = "html" | "mjml";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: MJMLBlock[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  blocks,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>("html");
  const [mjml, setMjml] = useState<string | null>(null);
  const [exportHtml, setExportHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setMjml(null);
    setExportHtml(null);
    let cancelled = false;
    (async () => {
      try {
        const mjmlString = blocksToGeneratedMjml(blocks);
        if (cancelled) return;
        setMjml(mjmlString);

        const mjml2html = (await import("mjml-browser")).default;
        const { html, errors } = mjml2html(mjmlString, {
          validationLevel: "skip",
        });
        if (!cancelled) {
          if (errors.length > 0) {
            setError(errors.map((e) => e.formattedMessage ?? e.message).join("; "));
          }
          setExportHtml(html);
        }
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

  useEffect(() => {
    if (isOpen) {
      setActiveTab("html");
      setCopied(false);
    }
  }, [isOpen]);

  const currentValue =
    activeTab === "html" ? exportHtml ?? "" : mjml ?? "";

  const handleCopy = useCallback(async () => {
    if (!currentValue) return;
    try {
      await navigator.clipboard.writeText(currentValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed");
    }
  }, [currentValue]);

  const handleDownload = useCallback(() => {
    if (!currentValue) return;
    const blob = new Blob([currentValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab === "html" ? "email.html" : "email.mjml";
    a.click();
    URL.revokeObjectURL(url);
  }, [currentValue, activeTab]);

  const showContent =
    (!loading && activeTab === "html" && exportHtml) ||
    (!loading && activeTab === "mjml" && mjml);

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export"
      width={720}
      height="80vh"
    >
      <div className="flex flex-col gap-4 h-full min-h-0 pb-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === "html"
                ? "bg-accent text-white"
                : "bg-white/5 text-text-light/60 hover:bg-white/10"
            }`}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mjml")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === "mjml"
                ? "bg-accent text-white"
                : "bg-white/5 text-text-light/60 hover:bg-white/10"
            }`}
          >
            MJML
          </button>
        </div>

        {loading && (
          <p className="text-sm text-text-light/60">
            Compiling MJML to email-friendly HTML…
          </p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {showContent && (
          <>
            <textarea
              readOnly
              value={currentValue}
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

