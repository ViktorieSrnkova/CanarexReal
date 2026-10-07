import type { JSONContent } from "@tiptap/core";
import "./TiptapRenderer.css";

type TiptapRendererProps = {
  content: JSONContent;
};
const renderChildren = (node: JSONContent) =>
  node.content?.map((child, childIndex) => renderNode(child, childIndex));

const renderNode = (node: JSONContent, index: number): React.ReactNode => {
  switch (node.type) {
    case "doc":
      return <div key={index}>{renderChildren(node)}</div>;

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
      return <ul key={index}>{renderChildren(node)}</ul>;

    case "orderedList":
      return <ol key={index}>{renderChildren(node)}</ol>;

    case "listItem":
      return <li key={index}>{renderChildren(node)}</li>;
    case "taskItem":
      return (
        <li
          key={index}
          className={`tiptap-task-item ${node.attrs?.checked ? "checked" : ""}`}
        >
          <input
            type="checkbox"
            checked={node.attrs?.checked === true}
            readOnly
          />

          <div className="tiptap-task-content">{renderChildren(node)}</div>
        </li>
      );
    case "blockquote":
      return <blockquote key={index}>{renderChildren(node)}</blockquote>;

    case "horizontalRule":
      return <hr key={index} />;

    case "hardBreak":
      return <br key={index} />;

    case "table":
      return (
        <table key={index}>
          <tbody>{renderChildren(node)}</tbody>
        </table>
      );

    case "tableRow":
      return <tr key={index}>{renderChildren(node)}</tr>;

    case "tableHeader":
      return (
        <th
          key={index}
          colSpan={node.attrs?.colspan ?? undefined}
          rowSpan={node.attrs?.rowspan ?? undefined}
        >
          {renderChildren(node)}
        </th>
      );

    case "tableCell":
      return (
        <td
          key={index}
          colSpan={node.attrs?.colspan ?? undefined}
          rowSpan={node.attrs?.rowspan ?? undefined}
        >
          {renderChildren(node)}
        </td>
      );
    case "image":
      return (
        <img
          key={index}
          src={node.attrs?.src}
          alt={node.attrs?.alt ?? ""}
          title={node.attrs?.title ?? undefined}
        />
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

  marks?.forEach((mark, index) => {
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
      case "textStyle": {
        const style: React.CSSProperties = {};

        if (mark.attrs?.color) {
          style.color = mark.attrs.color;
        }

        if (mark.attrs?.backgroundColor) {
          style.backgroundColor = mark.attrs.backgroundColor;
        }

        if (mark.attrs?.fontSize) {
          style.fontSize = mark.attrs.fontSize;
        }

        if (mark.attrs?.lineHeight) {
          style.lineHeight = mark.attrs.lineHeight;
        }

        result = (
          <span key={`text-style-${index}`} style={style}>
            {result}
          </span>
        );

        break;
      }

      default:
        break;
    }
  });

  return result;
};

export const TiptapRenderer = ({ content }: TiptapRendererProps) => {
  return <div className="tiptap-renderer">{renderNode(content, 0)}</div>;
};
