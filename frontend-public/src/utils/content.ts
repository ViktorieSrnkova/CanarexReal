import type { JSONContent } from "@tiptap/react";

export type EditorJSContent = {
  time?: number;
  blocks: {
    id?: string;
    type: string;
    data: Record<string, unknown>;
  }[];
  version?: string;
};

export type ListingContent = JSONContent | EditorJSContent | string;

export const isTiptapContent = (
  content: ListingContent,
): content is JSONContent => {
  return (
    typeof content === "object" &&
    content !== null &&
    "type" in content &&
    content.type === "doc"
  );
};

export const isEditorJSContent = (
  content: ListingContent,
): content is EditorJSContent => {
  return (
    typeof content === "object" &&
    content !== null &&
    "blocks" in content &&
    Array.isArray(content.blocks)
  );
};
