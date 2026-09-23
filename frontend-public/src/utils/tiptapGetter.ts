import type { JSONContent } from "@tiptap/react";

export const getTiptapText = (node: JSONContent): string => {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return node.content?.map((child) => getTiptapText(child)).join(" ") ?? "";
};
