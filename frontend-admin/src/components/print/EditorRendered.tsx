import React from "react";
import DOMPurify from "dompurify";
import type { EditorData } from "../../types/print";
import { ListRenderer } from "./ListRenderer";

type Props = {
  data: EditorData;
};

const EditorRenderer: React.FC<Props> = ({ data }) => {
  const sanitize = (html: string) => DOMPurify.sanitize(html);

  return (
    <div>
      {data.blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                style={{
                  textAlign: block.data.alignment ?? "left",
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: sanitize(block.data.text),
                }}
              />
            );

          case "list":
            return <ListRenderer key={index} block={block} />;

          default:
            return null;
        }
      })}
    </div>
  );
};
export default EditorRenderer;
