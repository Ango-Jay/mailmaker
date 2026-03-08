import { create } from "zustand";
import { nanoid } from "nanoid";
import { EditorState, MJElement } from "./types";

const initialTemplate: MJElement = {
  id: "root",
  type: "mjml",
  children: [
    {
      id: nanoid(),
      type: "mj-body",
      children: [
        {
          id: nanoid(),
          type: "mj-section",
          children: [
            {
              id: nanoid(),
              type: "mj-column",
              children: [
                {
                  id: nanoid(),
                  type: "mj-text",
                  content: "Hello World",
                  attributes: {
                    "font-size": "20px",
                    color: "#333333",
                    align: "center",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const useEditorStore = create<EditorState>((set) => ({
  template: initialTemplate,
  activeElementId: null,

  setTemplate: (template) => set({ template }),

  setActiveElementId: (id) => set({ activeElementId: id }),

  updateElementAttributes: (id, attributes) =>
    set((state) => {
      const updateRecursive = (element: MJElement): MJElement => {
        if (element.id === id) {
          return {
            ...element,
            attributes: { ...element.attributes, ...attributes },
          };
        }
        if (element.children) {
          return {
            ...element,
            children: element.children.map(updateRecursive),
          };
        }
        return element;
      };
      return { template: updateRecursive(state.template) };
    }),

  updateElementContent: (id, content) =>
    set((state) => {
      const updateRecursive = (element: MJElement): MJElement => {
        if (element.id === id) {
          return { ...element, content };
        }
        if (element.children) {
          return {
            ...element,
            children: element.children.map(updateRecursive),
          };
        }
        return element;
      };
      return { template: updateRecursive(state.template) };
    }),

  addElement: (parentId, newElement) =>
    set((state) => {
      // Helper to assign IDs recursively to a new element and its children
      const assignIds = (
        el: Omit<MJElement, "id"> & { id?: string },
      ): MJElement => ({
        ...el,
        id: nanoid(),
        children: el.children?.map(assignIds),
      });

      const elementWithIds = assignIds(newElement);

      const addRecursive = (element: MJElement): MJElement => {
        if (element.id === parentId) {
          return {
            ...element,
            children: [...(element.children || []), elementWithIds],
          };
        }
        if (element.children) {
          return { ...element, children: element.children.map(addRecursive) };
        }
        return element;
      };

      return { template: addRecursive(state.template) };
    }),

  removeElement: (id) =>
    set((state) => {
      const removeRecursive = (element: MJElement): MJElement | null => {
        if (element.id === id) return null;
        if (element.children) {
          return {
            ...element,
            children: element.children
              .map(removeRecursive)
              .filter((child): child is MJElement => child !== null),
          };
        }
        return element;
      };
      const newTemplate = removeRecursive(state.template);
      return { template: newTemplate || state.template };
    }),
}));
