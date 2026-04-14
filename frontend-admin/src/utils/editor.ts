import type { EditorContent, EditorBlock } from "../types/editor";
import { toFullImageUrl } from "../utils/url-cleaner";

export function hydrateImages(content: EditorContent): EditorContent {
  if (!content?.blocks) return { blocks: [] };

  return {
    ...content,
    blocks: content.blocks.map((block: EditorBlock) => {
      if (block.type !== "image") return block;

      const url = block.data?.file?.url || block.data?.url || "";

      return {
        ...block,
        data: {
          ...block.data,
          file: {
            url: toFullImageUrl(url),
          },
        },
      };
    }),
  };
}

export function safeParseEditor(text?: string): EditorContent {
  if (!text) return { blocks: [] };

  try {
    const parsed = JSON.parse(text);
    if (parsed?.blocks && Array.isArray(parsed.blocks)) return parsed;
    return { blocks: [] };
  } catch {
    return { blocks: [] };
  }
}
