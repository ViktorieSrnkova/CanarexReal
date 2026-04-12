import List from "@editorjs/list";
import Paragraph from "editorjs-paragraph-with-alignment";
import Underline from "@editorjs/underline";
import type { EditorTools } from "../types/listings";

export const liteEditorTools: EditorTools = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: ["bold", "italic", "underline", "link"],
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  underline: Underline,
};
