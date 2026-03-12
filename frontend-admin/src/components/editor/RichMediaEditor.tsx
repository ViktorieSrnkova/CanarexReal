// src/components/EditorMinimal.tsx
import React, { useEffect, useRef } from "react";
import "../../styles/richText.css";
import EditorJS, { type BlockToolConstructable } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import LinkTool from "@editorjs/link";
import { ImageToolTune } from "editorjs-image-resize-crop";

const EditorMinimal: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        placeholder: "Start writing here...",
        tools: {
          header: Header,
          image: {
            class: ImageTool,
            tunes: ["imageResize"],
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // temporary preview without backend
                  return {
                    success: 1,
                    file: { url: URL.createObjectURL(file), alt: file.name },
                  };
                },
              },
            },
          },
          imageResize: {
            class: ImageToolTune as BlockToolConstructable,
            config: {
              resize: true,
              crop: false,
            },
          },
          list: List,
          quote: Quote,
          delimiter: Delimiter,
          linkTool: LinkTool,
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
  }, []);

  return (
    <div
      id="editorjs"
      style={{ minHeight: 300, border: "1px solid #ccc", padding: 10 }}
    />
  );
};

export default EditorMinimal;
