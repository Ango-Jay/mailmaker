"use client";

import React, { useState } from "react";
import {
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer2,
  Minus,
  Columns,
  DivideSquare,
  LayoutTemplate,
  FileSignature,
  MessageSquareQuote,
  Image as BannerIcon,
} from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { ResponsiveModal } from "@/app/components/ui/Modal";

const COMPONENT_LIBRARY = [
  {
    type: "mj-section",
    icon: <Layout className="w-5 h-5" />,
    label: "Section",
  },
  { type: "mj-column", icon: <Columns className="w-5 h-5" />, label: "Column" },
  { type: "mj-text", icon: <Type className="w-5 h-5" />, label: "Text" },
  { type: "mj-image", icon: <ImageIcon className="w-5 h-5" />, label: "Image" },
  {
    type: "mj-button",
    icon: <MousePointer2 className="w-5 h-5" />,
    label: "Button",
  },
  { type: "mj-divider", icon: <Minus className="w-5 h-5" />, label: "Divider" },
  {
    type: "mj-spacer",
    icon: <DivideSquare className="w-5 h-5" />,
    label: "Spacer",
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

type Tab = "basic" | "cards";

export const Sidebar: React.FC = () => {
  const { addElement, template } = useEditorStore();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const findFirstParent = (element: any, targetType: string): string | null => {
    if (element.type === targetType) return element.id;
    if (element.children) {
      for (const child of element.children) {
        const foundId = findFirstParent(child, targetType);
        if (foundId) return foundId;
      }
    }
    return null;
  };

  const handleAddComponent = (type: string) => {
    const columnId = findFirstParent(template, "mj-column");

    if (columnId) {
      const defaultContent: Record<string, string> = {
        "mj-text": "New Text Element",
        "mj-button": "Click Me",
      };

      const defaultAttributes: Record<string, any> = {
        "mj-button": { "background-color": "#D65A31", color: "white" },
        "mj-image": { src: "https://via.placeholder.com/600x300" },
      };

      addElement(columnId, {
        id: "",
        type: type as any,
        content: defaultContent[type],
        attributes: defaultAttributes[type],
      });
    }
  };

  const handleAddPrefab = (id: string) => {
    const columnId = findFirstParent(template, "mj-column");
    if (!columnId) return;

    // Helper to generate a unique ID (normally handled by nanoid in store, but for nested children we might need to rely on the store's deep clone/ID generation if implemented, or we just pass empty IDs and let the store handle it)

    if (id === "signature") {
      addElement(columnId, {
        id: "",
        type: "mj-group",
        attributes: { width: "100%" },
        children: [
          {
            id: "",
            type: "mj-image",
            attributes: {
              src: "https://i.pravatar.cc/150",
              width: "80px",
              "border-radius": "40px",
              align: "left",
              padding: "10px",
            },
          },
          {
            id: "",
            type: "mj-text",
            attributes: { "padding-top": "20px" },
            content:
              "<strong>John Doe</strong><br/>CEO, Company Inc.<br/><a href='#'>@johndoe</a>",
          },
        ],
      });
    } else if (id === "testimonial") {
      addElement(columnId, {
        id: "",
        type: "mj-text",
        attributes: {
          "font-style": "italic",
          "border-left": "4px solid #D65A31",
          padding: "20px",
          "background-color": "#f8f9fa",
        },
        content:
          '"This product completely transformed our workflow. Highly recommended!"<br/><br/><strong>- Jane Smith</strong>',
      });
    } else if (id === "banner") {
      // For a banner, we might ideally want an mj-hero or a section with a background image.
      // Since we are adding to a column, we can use an image followed by text
      addElement(columnId, {
        id: "",
        type: "mj-image",
        attributes: {
          src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=300&fit=crop",
          padding: "0px",
          width: "600px",
        },
      });
      addElement(columnId, {
        id: "",
        type: "mj-text",
        attributes: {
          align: "center",
          "background-color": "#222831",
          color: "white",
          padding: "30px",
        },
        content: "<h2>Special Offer</h2><p>Get 50% off today only!</p>",
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
                  key={item.type}
                  onClick={() => handleAddComponent(item.type)}
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
        ) : (
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
