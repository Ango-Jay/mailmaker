"use client";

import React from "react";

interface EditorShellProps {
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
  properties: React.ReactNode;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  sidebar,
  canvas,
  properties,
}) => {
  return (
    <div className="flex h-screen bg-[#1a1c1e] text-white overflow-hidden">
      {/* Left Sidebar - Component Library */}
      <aside className="w-64 border-r border-white/10 bg-[#222831] flex flex-col">
        {sidebar}
      </aside>

      {/* Main Canvas - Preview */}
      <main className="flex-1 bg-secondary/10 relative overflow-hidden flex flex-col">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#222831]">
          <div className="flex items-center gap-2">
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
