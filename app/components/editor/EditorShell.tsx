"use client";

import React from "react";

interface EditorShellProps {
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
  properties: React.ReactNode;
}

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const EditorShell: React.FC<EditorShellProps> = ({
  sidebar,
  canvas,
  properties,
}) => {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#1a1c1e] text-white overflow-hidden">
      {/* Left Sidebar - Component Library */}
      <aside className="w-64 border-r border-white/10 bg-[#222831] flex flex-col">
        {sidebar}
      </aside>

      {/* Main Canvas - Preview */}
      <main className="flex-1 bg-secondary/10 relative overflow-hidden flex flex-col">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#222831]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-light/60 hover:text-white transition-all group"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold">
                Back
              </span>
            </button>
            <div className="w-px h-6 bg-white/10" />
            <span className="text-sm font-bold tracking-tight">
              MailMaker <span className="text-accent">Editor</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs bg-accent hover:bg-accent/90 px-4 py-2 rounded-lg font-bold transition-all">
              Export HTML
            </button>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto flex justify-center bg-[#1a1c1e]">
          {canvas}
        </div>
      </main>

      {/* Right Sidebar - Properties */}
      <aside className="w-80 border-l border-white/10 bg-[#222831] flex flex-col">
        {properties}
      </aside>
    </div>
  );
};
