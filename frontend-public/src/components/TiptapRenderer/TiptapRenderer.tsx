import type { JSONContent } from "@tiptap/core";
import "./TiptapRenderer.css";
import { gitHubEmojis } from "@tiptap/extension-emoji";

type TiptapRendererProps = {
  content: JSONContent;
};
const renderChildren = (node: JSONContent) =>
  node.content?.map((child, childIndex) => renderNode(child, childIndex));

const renderNode = (node: JSONContent, index: number): React.ReactNode => {
  switch (node.type) {
    case "doc":
      return <div key={index}>{renderChildren(node)}</div>;

    case "paragraph": {
      const isEmpty = !node.content || node.content.length === 0;

      return (
        <p
          key={index}
          style={{
            textAlign: node.attrs?.textAlign ?? undefined,
          }}
        >
          {isEmpty
            ? "\u00A0"
            : node.content?.map((child, childIndex) =>
                renderNode(child, childIndex),
              )}
        </p>
      );
    }

    case "heading": {
      const level = node.attrs?.level;

      const headingContent = node.content?.map((child, childIndex) =>
        renderNode(child, childIndex),
      );

      const headingStyle: React.CSSProperties = {
        textAlign: node.attrs?.textAlign ?? undefined,
      };

      switch (level) {
        case 1:
          return (
            <h1 key={index} style={headingStyle}>
              {headingContent}
            </h1>
          );

        case 2:
          return (
            <h2 key={index} style={headingStyle}>
              {headingContent}
            </h2>
          );

        case 3:
          return (
            <h3 key={index} style={headingStyle}>
              {headingContent}
            </h3>
          );

        case 4:
          return (
            <h4 key={index} style={headingStyle}>
              {headingContent}
            </h4>
          );

        case 5:
          return (
            <h5 key={index} style={headingStyle}>
              {headingContent}
            </h5>
          );

        case 6:
          return (
            <h6 key={index} style={headingStyle}>
              <b>{headingContent}</b>
            </h6>
          );

        default:
          return (
            <h2 key={index} style={headingStyle}>
              {headingContent}
            </h2>
          );
      }
    }

    case "bulletList":
      return (
        <ul
          key={index}
          style={{
            textAlign: node.attrs?.textAlign ?? undefined,
            lineHeight: node.attrs?.lineHeight ?? undefined,
          }}
        >
          {renderChildren(node)}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={index}
          style={{
            textAlign: node.attrs?.textAlign ?? undefined,
            lineHeight: node.attrs?.lineHeight ?? undefined,
          }}
        >
          {renderChildren(node)}
        </ol>
      );

    case "listItem":
      return (
        <li
          key={index}
          style={{
            textAlign: node.attrs?.textAlign ?? undefined,
          }}
        >
          {renderChildren(node)}
        </li>
      );

    case "taskList":
      return (
        <ul
          key={index}
          className="tiptap-task-list"
          style={{
            lineHeight: node.attrs?.lineHeight ?? undefined,
          }}
        >
          {renderChildren(node)}
        </ul>
      );
    case "taskItem": {
      const paragraph = node.content?.find(
        (child) => child.type === "paragraph",
      );

      const textAlign = paragraph?.attrs?.textAlign;

      const justifyContent =
        textAlign === "center"
          ? "center"
          : textAlign === "right"
            ? "flex-end"
            : "flex-start";

      return (
        <li
          key={index}
          className="tiptap-task-item"
          data-checked={node.attrs?.checked === true ? "true" : "false"}
          style={{ justifyContent }}
        >
          <input
            type="checkbox"
            checked={node.attrs?.checked === true}
            readOnly
          />

          <div className="tiptap-task-content">{renderChildren(node)}</div>
        </li>
      );
    }

    case "details":
      return (
        <details
          key={index}
          open={node.attrs?.open === true}
          className="tiptap-details"
        >
          {renderChildren(node)}
        </details>
      );

    case "detailsSummary":
      return <summary key={index}>{renderChildren(node)}</summary>;

    case "detailsContent":
      return (
        <div key={index} className="tiptap-details-content">
          {renderChildren(node)}
        </div>
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
    case "image": {
      const width = node.attrs?.width;
      const height = node.attrs?.height;
      const VITE_API_URL = import.meta.env.VITE_API_URL;
      return (
        <img
          key={index}
          src={`${VITE_API_URL}${node.attrs?.src}`}
          alt={node.attrs?.alt ?? ""}
          title={node.attrs?.title ?? undefined}
          width={typeof width === "number" ? width : undefined}
          height={typeof height === "number" ? height : undefined}
          style={{
            width: typeof width === "number" ? `${width}px` : undefined,
            height: typeof height === "number" ? `${height}px` : undefined,
            maxWidth: "100%",
            objectFit: "contain",
            marginTop: "0.5rem",
            marginBottom: "1rem",
          }}
        />
      );
    }
    case "emoji": {
      const emojiName = node.attrs?.name;

      const emoji = gitHubEmojis.find((item) => item.name === emojiName);

      return (
        <span
          key={index}
          className="tiptap-emoji"
          role="img"
          aria-label={String(emojiName ?? "emoji")}
        >
          {emoji?.emoji ?? ""}
        </span>
      );
    }
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
        result = (
          <sup
            style={{
              fontWeight: "inherit",
              textDecoration: "inherit",
              textUnderlineOffset: "-0.15em",
            }}
          >
            {result}
          </sup>
        );
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
