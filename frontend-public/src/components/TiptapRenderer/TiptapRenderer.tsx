import type { JSONContent } from "@tiptap/core";
import "./TiptapRenderer.css";

type TiptapRendererProps = {
  content: JSONContent;
};

const renderNode = (node: JSONContent, index: number): React.ReactNode => {
  switch (node.type) {
    case "doc":
      return (
        <div key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </div>
      );

    case "paragraph":
      return (
        <p
          key={index}
          style={{
            textAlign: node.attrs?.textAlign ?? undefined,
          }}
        >
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </p>
      );

    case "heading": {
      const level = node.attrs?.level;

      if (level === 1) {
        return (
          <h1 key={index}>
            {node.content?.map((child, childIndex) =>
              renderNode(child, childIndex),
            )}
          </h1>
        );
      }

      if (level === 2) {
        return (
          <h2 key={index}>
            {node.content?.map((child, childIndex) =>
              renderNode(child, childIndex),
            )}
          </h2>
        );
      }

      return (
        <h3 key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </h3>
      );
    }

    case "bulletList":
      return (
        <ul key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </ol>
      );

    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((child, childIndex) =>
            renderNode(child, childIndex),
          )}
        </li>
      );

    case "text":
      return (
        <span key={index}>{renderMarks(node.text ?? "", node.marks)}</span>
      );

    default:
      return null;
  }
};

const renderMarks = (
  text: string,
  marks: JSONContent["marks"],
): React.ReactNode => {
  let result: React.ReactNode = text;

  marks?.forEach((mark) => {
    switch (mark.type) {
      case "bold":
        result = <strong>{result}</strong>;
        break;

      case "italic":
        result = <em>{result}</em>;
        break;

      case "underline":
        result = <u>{result}</u>;
        break;

      case "superscript":
        result = <sup>{result}</sup>;
        break;

      case "link":
        result = (
          <a href={mark.attrs?.href} target="_blank" rel="noopener noreferrer">
            {result}
          </a>
        );
        break;

      default:
        break;
    }
  });

  return result;
};

export const TiptapRenderer = ({ content }: TiptapRendererProps) => {
  return <div className="tiptap-renderer">{renderNode(content, 0)}</div>;
};
