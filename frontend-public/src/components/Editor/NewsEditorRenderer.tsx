import React from "react";
import DOMPurify from "dompurify";
import type { NewsEditorData, ListItem } from "../../types/newsEditor";

type Props = {
  data: NewsEditorData;
};

const VITE_API_URL = import.meta.env.VITE_API_URL;

const EditorRenderer: React.FC<Props> = ({ data }) => {
  const sanitize = (html: string) => DOMPurify.sanitize(html);

  const renderListItems = (items: ListItem[]) => {
    return items.map((item, idx) => (
      <li key={idx}>
        <span
          dangerouslySetInnerHTML={{
            __html: sanitize(item.content),
          }}
        />

        {item.items?.length > 0 && <ul>{renderListItems(item.items)}</ul>}
      </li>
    ));
  };

  return (
    <div>
      {data.blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={block.id}
                style={{
                  textAlign: block.data.alignment ?? "left",
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: sanitize(block.data.text),
                }}
              />
            );

          case "header": {
            const level = block.data.level ?? 2;

            const commonProps = {
              key: block.id,
              style: {
                textAlign: block.data.alignment ?? "left",
              } as React.CSSProperties,
              dangerouslySetInnerHTML: {
                __html: sanitize(block.data.text),
              },
            };

            switch (level) {
              case 1:
                return <h1 {...commonProps} />;

              case 2:
                return <h2 {...commonProps} />;

              case 3:
                return <h3 {...commonProps} />;

              case 4:
                return <h4 {...commonProps} />;

              case 5:
                return <h5 {...commonProps} />;

              case 6:
                return <h6 {...commonProps} />;

              default:
                return <h2 {...commonProps} />;
            }
          }

          case "list": {
            const Tag = block.data.style === "ordered" ? "ol" : "ul";

            return (
              <Tag
                key={block.id}
                style={{
                  lineHeight: 1.6,
                }}
              >
                {renderListItems(block.data.items)}
              </Tag>
            );
          }

          case "image": {
            const tune = block.tunes?.imageTunePlus;

            return (
              <figure
                key={block.id}
                style={{
                  textAlign: tune?.align ?? "center",
                  margin: "2rem 0",
                }}
              >
                <img
                  src={`${VITE_API_URL}${block.data.file.url}`}
                  alt={block.data.caption ?? ""}
                  style={{
                    width: `${tune?.width ?? 100}%`,
                    maxWidth: "100%",
                    borderRadius: `${tune?.rounded ?? 0}px`,
                    display: "inline-block",
                  }}
                />

                {block.data.caption && (
                  <figcaption
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      opacity: 0.8,
                    }}
                  >
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          default:
            //console.warn("Unsupported EditorJS block:", block.type);

            return null;
        }
      })}
    </div>
  );
};

export default EditorRenderer;
