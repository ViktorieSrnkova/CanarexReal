import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

export type EditorTools = Record<string, ToolConstructable | ToolSettings>;

export type EditorContent = {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
};

export type EditorBlock = {
  type: string;
  data: {
    file?: {
      url?: string;
      id?: number;
    };
    imageId?: number;
    url?: string;
    [key: string]: unknown;
  };
};

type ListItem = {
  content: string;
  meta?: Record<string, unknown>;
  items: ListItem[];
};

type ListBlock = {
  id: string;
  type: "list";
  data: {
    style: "ordered" | "unordered";
    meta?: Record<string, unknown>;
    items: ListItem[];
  };
};

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: {
    text: string;
    alignment: "left";
  };
};

export type EditorData = {
  time?: number;
  version?: string;
  blocks: (ListBlock | ParagraphBlock)[];
};
