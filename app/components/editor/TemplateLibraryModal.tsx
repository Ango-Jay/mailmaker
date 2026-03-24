"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { ResponsiveModal } from "@/app/components/ui/Modal";

export interface TemplateLibraryCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  /** Number of description text rows to show (line-clamp). */
  rows?: number;
}

/** Main-library card id that opens the column count step (not passed to onAddPrefab). */
export const TEMPLATE_LIBRARY_COLUMN_STEP_ID = "column";

const COLUMN_VARIANTS: {
  id: string;
  label: string;
  desc: string;
}[] = [
  { id: "columns1", label: "1 Column", desc: "Single full-width column for stacked content." },
  { id: "columns2", label: "2 Columns", desc: "Two equal columns side by side." },
  { id: "columns3", label: "3 Columns", desc: "Three columns for features or comparisons." },
  { id: "columns4", label: "4 Columns", desc: "Four narrow columns for icons or stats." },
];

type LibraryStep = "main" | "columns";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: TemplateLibraryCard[];
  onAddPrefab: (id: string) => void;
}

export function TemplateLibraryModal({
  isOpen,
  onClose,
  cards,
  onAddPrefab,
}: TemplateLibraryModalProps) {
  const [step, setStep] = useState<LibraryStep>("main");

  useEffect(() => {
    if (isOpen) setStep("main");
  }, [isOpen]);

  const handleMainCardClick = (id: string) => {
    if (id === TEMPLATE_LIBRARY_COLUMN_STEP_ID) {
      setStep("columns");
      return;
    }
    onAddPrefab(id);
  };

  const handleColumnVariantClick = (id: string) => {
    onAddPrefab(id);
  };

  const modalTitle =
    step === "main" ? "Template Library" : "Choose column layout";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      width={800}
      radius={24}
    >
      {step === "columns" && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setStep("main")}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-light/50 hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to library
          </button>
        </div>
      )}

      {step === "main" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleMainCardClick(card.id)}
              className="flex flex-col text-left p-6 bg-[#1a1c1e] border border-white/5 rounded-2xl hover:border-accent/50 hover:bg-white/5 transition-all group"
            >
              {card.icon}
              <h4 className="font-bold text-white mb-2">{card.label}</h4>
              <p
                className="text-xs text-text-light/60 leading-relaxed group-hover:text-text-light/80 transition-colors"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: card.rows ?? 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {card.desc}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {COLUMN_VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleColumnVariantClick(v.id)}
              className="flex flex-col text-left p-6 bg-[#1a1c1e] border border-white/5 rounded-2xl hover:border-accent/50 hover:bg-white/5 transition-all group"
            >
              <LayoutGrid className="w-8 h-8 text-accent mb-3" />
              <h4 className="font-bold text-white mb-2">{v.label}</h4>
              <p className="text-xs text-text-light/60 leading-relaxed group-hover:text-text-light/80 transition-colors">
                {v.desc}
              </p>
            </button>
          ))}
        </div>
      )}
    </ResponsiveModal>
  );
}
