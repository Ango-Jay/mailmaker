import { EditorShell } from "../components/editor/EditorShell";
import { Sidebar } from "../components/editor/Sidebar";
import { Canvas } from "../components/editor/Canvas";
import { PropertyEditor } from "../components/editor/PropertyEditor";

export default function EditorPage() {
  return (
    <EditorShell
      sidebar={<Sidebar />}
      canvas={<Canvas />}
      properties={<PropertyEditor />}
    />
  );
}
