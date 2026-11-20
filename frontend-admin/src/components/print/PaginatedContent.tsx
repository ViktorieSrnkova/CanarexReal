import { useLayoutEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { TiptapRenderer } from "./TiptapRenderer";

type Props = {
  content: JSONContent;
  availableHeight: number;
};

export default function PaginatedContent({ content, availableHeight }: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<JSONContent[][]>([]);

  useLayoutEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const blocks = content.content ?? [];
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(".tiptap-renderer > div > *"),
    );

    const result: JSONContent[][] = [[]];
    let usedHeight = 0;

    blocks.forEach((block, index) => {
      const element = elements[index];
      if (!element) return;

      const styles = window.getComputedStyle(element);
      const height =
        element.getBoundingClientRect().height +
        parseFloat(styles.marginTop) +
        parseFloat(styles.marginBottom);

      if (
        usedHeight + height > availableHeight &&
        result[result.length - 1].length > 0
      ) {
        result.push([]);
        usedHeight = 0;
      }

      result[result.length - 1].push(block);
      usedHeight += height;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPages(result);
  }, [content, availableHeight]);

  return (
    <>
      <div
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <TiptapRenderer content={content} />
      </div>

      {pages.map((blocks, index) => (
        <div key={index} className="paginated-content-page">
          <TiptapRenderer
            content={{
              type: "doc",
              content: blocks,
            }}
          />
        </div>
      ))}
    </>
  );
}
