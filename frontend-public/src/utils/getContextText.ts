/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSONContent } from "@tiptap/react";

type EditorJSContent = {
  blocks?: {
    data?: {
      text?: string;
    };
  }[];
};

export const getTiptapText = (node: JSONContent): string => {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return node.content?.map((child) => getTiptapText(child)).join(" ") ?? "";
};

export const getContentText = (
  content: JSONContent | EditorJSContent | string,
): string => {
  if (typeof content === "string") {
    return content;
  }

  if ("blocks" in content) {
    return (
      content.blocks
        ?.map((block: { data: { text: any } }) => block.data?.text ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() ?? ""
    );
  }

  return getTiptapText(content).replace(/\s+/g, " ").trim();
};
