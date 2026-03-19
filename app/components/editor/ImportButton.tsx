"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { ResponsiveModal } from "@/app/components/ui/Modal";
import { useTemplateStore } from "@/lib/editor/template-store";
import type { BlockType } from "@/lib/editor/block-types";

type ImportStep = "options" | "html" | "mjml";

export function ImportButton() {
  const { addBlock } = useTemplateStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ImportStep>("options");
  const [htmlValue, setHtmlValue] = useState("");
  const [mjmlValue, setMjmlValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (loading) return;
    setIsOpen(false);
    setStep("options");
    setError(null);
  };

  const title = useMemo(() => {
    if (step === "html") return "Import HTML";
    if (step === "mjml") return "Import MJML";
    return "Import";
  }, [step]);

  const submit = async () => {
    setError(null);

    const trimmed =
      step === "html" ? htmlValue.trim() : step === "mjml" ? mjmlValue.trim() : "";
    if (!trimmed) {
      setError(step === "html" ? "Paste HTML first." : "Paste MJML first.");
      return;
    }

    // Note: actual sanitization happens at export time.
    setLoading(true);
    try {
      const type: BlockType = step === "html" ? "html" : "mjml";
      addBlock({ type, content: trimmed });

      setHtmlValue("");
      setMjmlValue("");
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStep("options");
          setError(null);
        }}
        className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold transition-all"
        title="Import HTML or MJML"
      >
        Import
      </button>

{
  isOpen && (
    <ResponsiveModal
    isOpen={isOpen}
    onClose={close}
    title={title}
    width={760}
    height={step === "options" ? "auto" : "80vh"}
    radius={18}
  >
    {step === "options" && (
      <div className="space-y-4 pb-4">
        <div className="text-sm text-text-light/60 leading-relaxed">
          Choose an import mode. The imported content becomes a single block
          in your template, preserving ordering with the rest of your blocks.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setStep("html")}
            className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
          >
            <Upload className="w-5 h-5 text-accent" />
            <div>
              <div className="text-sm font-bold">Import HTML</div>
              <div className="text-xs text-text-light/60">
                Paste HTML, it will be sanitized before export.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStep("mjml")}
            className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
          >
            <Upload className="w-5 h-5 text-accent" />
            <div>
              <div className="text-sm font-bold">Import MJML</div>
              <div className="text-xs text-text-light/60">
                Paste MJML fragment (inside a column).
              </div>
            </div>
          </button>
        </div>
      </div>
    )}

    {step !== "options" && (
      <div className="flex flex-col gap-4 h-full min-h-0 pb-4">
        <div className="text-sm text-text-light/60 leading-relaxed">
          {step === "html" ? (
            <>
              Paste HTML. Scripts and unsafe parts are removed during
              export. Email client support may vary.
            </>
          ) : (
            <>
              Paste MJML that you want inserted into the email body.
              Provide MJML components (e.g. <code>mj-text</code>), not a full
              <code>mjml</code> document.
            </>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <textarea
            value={step === "html" ? htmlValue : mjmlValue}
            onChange={(e) =>
              step === "html" ? setHtmlValue(e.target.value) : setMjmlValue(e.target.value)
            }
            className="w-full h-full min-h-[320px] bg-[#1a1c1e] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-text-light overflow-auto focus:outline-none"
            spellCheck={false}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              if (loading) return;
              setStep("options");
              setError(null);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors"
            disabled={loading}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Importing…" : "Import"}
            </button>
          </div>
        </div>
      </div>
    )}
  </ResponsiveModal>
  )
}
    </>
  );
}

