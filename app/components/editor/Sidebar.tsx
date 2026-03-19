"use client";

import React, { useState } from "react";
import {
  Type,
  Image as ImageIcon,
  MousePointer2,
  Minus,
  DivideSquare,
  LayoutTemplate,
  FileSignature,
  MessageSquareQuote,
  Image as BannerIcon,
} from "lucide-react";
import { useTemplateStore } from "@/lib/editor/template-store";
import type { MJMLBlock, BlockType } from "@/lib/editor/block-types";
import { ResponsiveModal } from "@/app/components/ui/Modal";
import { useImageUploadModalStore } from "@/lib/editor/image-upload-modal-store";
import { useLayoutStore } from "@/lib/editor/layout-store";
import { StepperInput } from "./PropertyEditor/StepperInput";
import { ColorPicker } from "@/app/components/ui/ColorPicker";

const COMPONENT_LIBRARY: {
  type: BlockType;
  icon: React.ReactNode;
  label: string;
  defaultBlock: Omit<MJMLBlock, "id">;
}[] = [
  {
    type: "text",
    icon: <Type className="w-5 h-5" />,
    label: "Text",
    defaultBlock: { type: "text", content: "New text", size: "medium", textStyle: "paragraph" },
  },
  {
    type: "image",
    icon: <ImageIcon className="w-5 h-5" />,
    label: "Image",
    defaultBlock: {
      type: "image",
      src: "",
      alt: "",
    },
  },
  {
    type: "button",
    icon: <MousePointer2 className="w-5 h-5" />,
    label: "Button",
    defaultBlock: {
      type: "button",
      text: "Click Me",
      link: "#",
      backgroundColor: "#D65A31",
      textColor: "#ffffff",
    },
  },
  {
    type: "divider",
    icon: <Minus className="w-5 h-5" />,
    label: "Divider",
    defaultBlock: { type: "divider", height: "2px", backgroundColor: "#e5e5e5" },
  },
  {
    type: "spacer",
    icon: <DivideSquare className="w-5 h-5" />,
    label: "Spacer",
    defaultBlock: { type: "spacer", height: "20px" },
  },
];

const PREFAB_CARDS = [
  {
    id: "signature",
    icon: <FileSignature className="w-8 h-8 text-accent mb-3" />,
    label: "Email Signature",
    desc: "Professional signature with photo and social links",
  },
  {
    id: "testimonial",
    icon: <MessageSquareQuote className="w-8 h-8 text-accent mb-3" />,
    label: "Testimonial",
    desc: "Quote block with author attribution",
  },
  {
    id: "banner",
    icon: <BannerIcon className="w-8 h-8 text-accent mb-3" />,
    label: "Hero Banner",
    desc: "Full-width image with overlaid text and CTA",
  },
];

type Tab = "basic" | "cards" | "layout";

export const Sidebar: React.FC = () => {
  const { addBlock } = useTemplateStore();
  const openImageUploadModal = useImageUploadModalStore((s) => s.openForAdd);
  const {
    contentAreaWidth,
    contentAreaAlignment,
    backgroundColor,
    contentAreaBackgroundColor,
    backgroundImageEnabled,
    defaultFontFamily,
    linkColor,
    language,
    setContentAreaWidth,
    setContentAreaAlignment,
    setBackgroundColor,
    setContentAreaBackgroundColor,
    setBackgroundImageEnabled,
    setDefaultFontFamily,
    setLinkColor,
    setLanguage,
  } = useLayoutStore();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddComponent = (item: (typeof COMPONENT_LIBRARY)[number]) => {
    if (item.type === "image") {
      openImageUploadModal();
    } else {
      addBlock(item.defaultBlock);
    }
  };

  const handleAddPrefab = (id: string) => {
    if (id === "signature") {
      addBlock({
        type: "card",
        variant: "minimal",
        title: "John Doe",
        subtitle: "CEO, Company Inc.",
        ctaText: "@johndoe",
        link: "#",
      });
    } else if (id === "testimonial") {
      addBlock({
        type: "card",
        variant: "minimal",
        description:
          '"This product completely transformed our workflow. Highly recommended!" — Jane Smith',
        italic: true,
      });
    } else if (id === "banner") {
      addBlock({
        type: "card",
        variant: "feature",
        title: "Special Offer",
        description: "Get 50% off today only!",
        ctaText: "Shop Now",
        link: "#",
        backgroundColor: "#222831",
        textColor: "#ffffff",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#222831]">
      {/* Tabs */}
      <div className="flex border-b border-white/5 p-2 gap-1 flex-shrink-0">
        <button
          onClick={() => setActiveTab("basic")}
          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "basic"
              ? "bg-white/10 text-white"
              : "text-text-light/40 hover:text-text-light hover:bg-white/5"
          }`}
        >
          Basic
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "cards"
              ? "bg-accent text-white"
              : "text-text-light/40 hover:text-text-light hover:bg-white/5"
          }`}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
            activeTab === "layout"
              ? "bg-accent text-white"
              : "text-text-light/40 hover:text-text-light hover:bg-white/5"
          }`}
        >
          Layout
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "basic" ? (
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Core Library
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {COMPONENT_LIBRARY.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAddComponent(item)}
                  className="flex flex-col items-center justify-center gap-3 py-6 px-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-accent/30 transition-all group"
                >
                  <div className="text-text-light/40 group-hover:text-accent transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium text-text-light/80 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === "cards" ? (
          <div className="space-y-6 flex flex-col items-center justify-center h-full pb-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-2">
              <LayoutTemplate className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-sm font-bold text-white">Pre-built Cards</h3>
              <p className="text-xs text-text-light/60 px-4 leading-relaxed">
                Speed up your workflow using professionally designed composite
                blocks.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-all"
            >
              Browse Library
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Design Settings
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-text-light/60">
                  Content area width
                </label>
                <StepperInput
                  value={contentAreaWidth}
                  onChange={(v) => setContentAreaWidth(v)}
                  step={10}
                  min={375}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-text-light/60">
                  Content area alignment
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setContentAreaAlignment("left")}
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                      contentAreaAlignment === "left"
                        ? "bg-accent text-white border-accent"
                        : "bg-white/5 border-white/10 text-text-light/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentAreaAlignment("center")}
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                      contentAreaAlignment === "center"
                        ? "bg-accent text-white border-accent"
                        : "bg-white/5 border-white/10 text-text-light/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentAreaAlignment("right")}
                    className={`flex-1 px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                      contentAreaAlignment === "right"
                        ? "bg-accent text-white border-accent"
                        : "bg-white/5 border-white/10 text-text-light/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              <ColorPicker
                label="Background color"
                value={backgroundColor}
                onChange={(v) => setBackgroundColor(v)}
                id="layout-bg-color"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-text-light/60">
                  Content background color
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContentAreaBackgroundColor("transparent")}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                      contentAreaBackgroundColor === "transparent"
                        ? "bg-accent text-white border-accent"
                        : "bg-white/5 border-white/10 text-text-light/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Transparent
                  </button>
                  <div className="flex-1 min-w-0">
                    {contentAreaBackgroundColor === "transparent" ? (
                      <div className="w-full h-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-text-light/40 flex items-center">
                        Choose a color below
                      </div>
                    ) : (
                      <ColorPicker
                        label="Pick color"
                        value={contentAreaBackgroundColor}
                        onChange={(v) => setContentAreaBackgroundColor(v)}
                        id="layout-content-bg-color"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-text-light/60">
                  Background image
                </label>
                <button
                  type="button"
                  onClick={() => setBackgroundImageEnabled(!backgroundImageEnabled)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                    backgroundImageEnabled
                      ? "bg-accent/20 border-accent/30 text-accent"
                      : "bg-white/5 border-white/10 text-text-light/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{backgroundImageEnabled ? "Enabled" : "Disabled"}</span>
                  <span
                    className={`inline-flex items-center justify-center w-10 h-6 rounded-full border ${
                      backgroundImageEnabled
                        ? "bg-accent border-accent text-white"
                        : "bg-white/5 border-white/10 text-text-light/60"
                    }`}
                  >
                    {backgroundImageEnabled ? "On" : "Off"}
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-text-light/60">
                  Default font
                </label>
                <select
                  value={defaultFontFamily}
                  onChange={(e) => setDefaultFontFamily(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent"
                >
                  <option value="Inter, Arial, sans-serif">Inter</option>
                  <option value="Arial, Helvetica, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="Times New Roman, Times, serif">Times New Roman</option>
                </select>
              </div>

              <ColorPicker
                label="Link color"
                value={linkColor}
                onChange={(v) => setLinkColor(v)}
                id="layout-link-color"
              />
            </div>

            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Metadata
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-text-light/60">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Cards Modal */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Template Library"
        width={800}
        radius={24}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREFAB_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleAddPrefab(card.id)}
              className="flex flex-col text-left p-6 bg-[#1a1c1e] border border-white/5 rounded-2xl hover:border-accent/50 hover:bg-white/5 transition-all group"
            >
              {card.icon}
              <h4 className="font-bold text-white mb-2">{card.label}</h4>
              <p className="text-xs text-text-light/60 leading-relaxed group-hover:text-text-light/80 transition-colors">
                {card.desc}
              </p>
            </button>
          ))}
        </div>
      </ResponsiveModal>
    </div>
  );
};
