import type { Editor } from "@tiptap/react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type BlockType = "paragraph" | HeadingLevel | "mixed";

export const getCurrentBlockType = (editor: Editor): BlockType => {
  const { from, to } = editor.state.selection;
  const types = new Set<string>();

  editor.state.doc.nodesBetween(from, to, (node) => {
    if (node.type.name === "paragraph") {
      types.add("paragraph");
    }

    if (node.type.name === "heading") {
      types.add(`heading-${node.attrs.level}`);
    }
  });

  if (types.size === 0) {
    return editor.isActive("heading")
      ? (editor.getAttributes("heading").level as HeadingLevel)
      : "paragraph";
  }

  if (types.size > 1) {
    return "mixed";
  }

  const type = [...types][0];

  if (type === "paragraph") {
    return "paragraph";
  }

  return Number(type.replace("heading-", "")) as HeadingLevel;
};
export type LineHeight = "1.4" | "1.5" | "2.0" | "2.5" | "3.0" | "mixed";

export const getCurrentLineHeight = (editor: Editor): LineHeight => {
  const { from, to } = editor.state.selection;
  const values = new Set<string>();

  editor.state.doc.nodesBetween(from, to, (node) => {
    if (!node.isText) {
      return;
    }

    const lineHeightMark = node.marks.find(
      (mark) =>
        mark.type.name === "textStyle" &&
        mark.attrs.lineHeight !== null &&
        mark.attrs.lineHeight !== undefined,
    );

    values.add(lineHeightMark?.attrs.lineHeight ?? "1.4");
  });

  if (values.size > 1) {
    return "mixed";
  }

  if (values.size === 1) {
    return [...values][0] as LineHeight;
  }

  return "1.4";
};

export const getTableHeaderState = (editor: Editor) => {
  const { $from } = editor.state.selection;

  let tableNode = null;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);

    if (node.type.name === "table") {
      tableNode = node;
      break;
    }
  }

  if (!tableNode) {
    return {
      isHeaderCell: false,
      isHeaderRow: false,
      isHeaderColumn: false,
    };
  }

  let cellDepth = -1;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);

    if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
      cellDepth = depth;
      break;
    }
  }

  if (cellDepth === -1) {
    return {
      isHeaderCell: false,
      isHeaderRow: false,
      isHeaderColumn: false,
    };
  }

  const cellNode = $from.node(cellDepth);

  const firstRow = tableNode.firstChild;

  const isHeaderRow =
    firstRow !== null &&
    firstRow.childCount > 0 &&
    Array.from({ length: firstRow.childCount }).every(
      (_, index) => firstRow.child(index).type.name === "tableHeader",
    );

  const isHeaderColumn =
    tableNode.childCount > 0 &&
    Array.from({ length: tableNode.childCount }).every((_, rowIndex) => {
      const row = tableNode.child(rowIndex);

      return row.childCount > 0 && row.child(0).type.name === "tableHeader";
    });

  return {
    isHeaderCell: cellNode.type.name === "tableHeader",
    isHeaderRow,
    isHeaderColumn,
  };
};
