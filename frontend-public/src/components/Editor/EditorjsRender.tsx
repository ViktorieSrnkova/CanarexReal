import React from "react";
import { ListRenderer } from "./ListRenderer";
import type { EditorData } from "../../types/editor";
import DOMPurify from "dompurify";

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
