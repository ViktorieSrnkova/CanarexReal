import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import "../../styles/richText.css";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import type { EditorTools } from "../../types/listings";

export type EditorMinimalRef = {
  save: () => Promise<EditorJS.OutputData>;
  clear: () => void;
  destroy: () => void;
  render: (data: EditorJS.OutputData) => Promise<void>;
};
type Props = {
  id: string;
  onReady?: () => void;
  tools: EditorTools;
  value?: EditorJS.OutputData;
  onChange?: (value: EditorJS.OutputData) => void;
};

const EditorMinimal = forwardRef<EditorMinimalRef, Props>(
  ({ id, onReady, tools, value, onChange }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const isInitialRender = useRef(true);
    useImperativeHandle(ref, () => ({
      save: async () => {
        if (!editorRef.current) throw new Error("Editor not initialized");
        return await editorRef.current.save();
      },
      clear: () => editorRef.current?.clear(),
      destroy: () => editorRef.current?.destroy(),
      render: async (data: EditorJS.OutputData) => {
        if (!editorRef.current) return;

        await editorRef.current.render(data);
      },
    }));
    useEffect(() => {
      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          onReady: () => {
            new DragDrop(editorRef.current);
            onReady?.();
          },
          holder: id,
          autofocus: false,
          placeholder: "Start writing here...",
          tools,
          onChange: async () => {
            const data = await editorRef.current?.save();
            if (data && onChange) {
              onChange(data);
            }
          },
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
    }, [id, tools]);
    useEffect(() => {
      if (!editorRef.current || !value) return;

      if (isInitialRender.current) {
        editorRef.current.render(value);
        isInitialRender.current = false;
      }
    }, [value]);

    return (
      <div
        id={id}
        style={{
          minHeight: 150,
          border: "1px solid #26c9ff8e",
          padding: 10,
          borderRadius: 4,
        }}
      />
    );
  },
);

export default EditorMinimal;
