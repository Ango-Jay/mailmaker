"use client";

import React, { useEffect, useState } from "react";
import mjml2html from "mjml-browser";
import { Monitor, Smartphone } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { jsonToMjml } from "@/lib/editor/transformer";

export const Canvas: React.FC = () => {
  const { template, activeElementId, setActiveElementId } = useEditorStore();
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  // Convert JSON to MJML and then to HTML
  useEffect(() => {
    try {
      const mjml = jsonToMjml(template, activeElementId);

      // Inject a custom style for the selected element
      const mjmlWithStyle = mjml.replace(
        "<mjml>",
        `
<mjml>
  <mj-head>
    <mj-style>
      .selected-element { outline: 2px solid #D65A31 !important; outline-offset: -2px; cursor: pointer; }
      * { cursor: default; }
      mj-text, mj-button, mj-image { cursor: pointer; }
    </mj-style>
  </mj-head>`,
      );

      const { html: compiledHtml, errors } = mjml2html(mjmlWithStyle);

      // Post-process HTML to add click listeners to elements with data-id
      const script = `
        <script>
          document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-id]');
            if (target) {
              const id = target.getAttribute('data-id');
              window.parent.postMessage({ type: 'SELECT_ELEMENT', id }, '*');
            }
          });
        </script>
      `;

      setHtml(compiledHtml + script);
      setError(null);
    } catch (err) {
      console.error("Compilation Error:", err);
      setError("Failed to compile MJML");
    }
  }, [template, activeElementId]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SELECT_ELEMENT") {
        setActiveElementId(event.data.id);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setActiveElementId]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-500/10 rounded-lg border border-red-500/20 px-6 py-4 text-red-500 text-sm">
        {error}
      </div>
    );
  }

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

      {/* Frame Container */}
      <div
        className={`h-full bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 border border-white/5 ${
          viewMode === "desktop" ? "w-full max-w-4xl" : "w-[375px]"
        }`}
      >
        <iframe
          title="Email Preview"
          srcDoc={html}
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};
