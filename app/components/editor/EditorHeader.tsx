"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { ImportButton } from "./ImportButton";

interface EditorHeaderProps {
  onBack: () => void;
  onExport: () => void;
}

export function EditorHeader({ onBack, onExport }: EditorHeaderProps) {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#222831]">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-light/60 hover:text-white transition-all group"
          title="Back to Home"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-bold">Back</span>
        </button>
        <div className="w-px h-6 bg-white/10" />
        <span className="text-sm font-bold tracking-tight">
          MailMaker <span className="text-accent">Editor</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ImportButton />
        <button
          type="button"
          onClick={onExport}
          className="text-xs bg-accent hover:bg-accent/90 px-4 py-2 rounded-lg font-bold transition-all"
        >
          Export
        </button>
      </div>
    </header>
  );
}

