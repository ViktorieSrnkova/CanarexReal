import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "../../styles/richText.css";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import { tools } from "../../config/editor-tools";

export type EditorMinimalRef = {
  save: () => Promise<EditorJS.OutputData>;
};

const EditorMinimal = forwardRef<EditorMinimalRef>((_, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorRef.current) throw new Error("Editor not initialized");
      return await editorRef.current.save();
    },
  }));
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        onReady: () => {
          new DragDrop(editorRef.current);
        },
        holder: "editorjs",
        autofocus: true,
        placeholder: "Start writing here...",
        tools,
      });

      return () => {
        if (
          editorRef.current &&
          typeof editorRef.current.destroy === "function"
        ) {
          editorRef.current.destroy();
        }
      };
    }
  }, []);

  return (
    <div
      id="editorjs"
      style={{ minHeight: 300, border: "1px solid #ccc", padding: 10 }}
    />
  );
});

export default EditorMinimal;
