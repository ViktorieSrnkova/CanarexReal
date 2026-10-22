/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JSONContent } from "@tiptap/react";

export const getTiptapText = (node: JSONContent): string => {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return node.content?.map((child) => getTiptapText(child)).join(" ") ?? "";
};

export const getContentText = (content: JSONContent | string): string => {
  if (typeof content === "string") {
    return content;
  }

  return getTiptapText(content).replace(/\s+/g, " ").trim();
};
