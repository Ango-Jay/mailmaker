"use client";

import React, { useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { EditorShell } from "./EditorShell";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { PropertyEditor } from "./PropertyEditor";
import { useTemplateStore } from "@/lib/editor/template-store";

const SIDEBAR_PREFIX = "sidebar-";

export function EditorWithDnd() {
  const { blocks, addBlock, reorderBlocksById } = useTemplateStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      // Dropping from sidebar onto canvas
      if (activeId.startsWith(SIDEBAR_PREFIX)) {
        const defaultBlock = active.data.current?.defaultBlock as
          | Omit<import("@/lib/editor/block-types").MJMLBlock, "id">
          | undefined;
        if (!defaultBlock) return;

        if (overId === "canvas-drop") {
          addBlock(defaultBlock, blocks.length);
          return;
        }
        const insertIndex = blocks.findIndex((b) => b.id === overId);
        addBlock(defaultBlock, insertIndex >= 0 ? insertIndex : blocks.length);
        return;
      }

      // Reordering within canvas
      if (activeId !== overId && blocks.some((b) => b.id === activeId)) {
        reorderBlocksById(activeId, overId);
      }
    },
    [blocks, addBlock, reorderBlocksById]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <EditorShell
        sidebar={<Sidebar />}
        canvas={<Canvas />}
        properties={<PropertyEditor />}
      />
    </DndContext>
  );
}
