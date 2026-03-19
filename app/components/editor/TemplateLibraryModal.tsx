"use client";

import React from "react";
import { ResponsiveModal } from "@/app/components/ui/Modal";

export interface TemplateLibraryCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  /** Number of description text rows to show (line-clamp). */
  rows?: number;
}

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
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Template Library"
      width={800}
      radius={24}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onAddPrefab(card.id)}
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
    </ResponsiveModal>
  );
}

