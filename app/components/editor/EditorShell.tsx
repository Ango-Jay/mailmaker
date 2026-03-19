"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplateStore } from "@/lib/editor/template-store";
import { ExportModal } from "./ExportModal";
import { ImageUploadModal } from "./ImageUploadModal";
import { EditorHeader } from "./EditorHeader";

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
  const router = useRouter();
  const { blocks } = useTemplateStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#1a1c1e] text-white overflow-hidden">
      {/* Left Sidebar - Component Library */}
      <aside className="w-64 border-r border-white/10 bg-[#222831] flex flex-col">
        {sidebar}
      </aside>

      {/* Main Canvas - Preview */}
      <main className="flex-1 bg-secondary/10 relative overflow-hidden flex flex-col">
        <EditorHeader
          onBack={() => router.push("/")}
          onExport={() => setExportModalOpen(true)}
        />
        <div className="flex-1 p-8 overflow-auto flex justify-center bg-[#1a1c1e]">
          {canvas}
        </div>
      </main>

      {/* Right Sidebar - Properties */}
      <aside className="w-80 border-l border-white/10 bg-[#222831] flex flex-col">
        {properties}
      </aside>

      {exportModalOpen && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          blocks={blocks}
        />
      )}
      <ImageUploadModal />
    </div>
  );
};
