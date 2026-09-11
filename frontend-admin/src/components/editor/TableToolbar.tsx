import type { Editor } from "@tiptap/react";
import { useState } from "react";
import "./tabletoolbar.css";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  HighlightOutlined,
  InsertRowAboveOutlined,
  InsertRowLeftOutlined,
  MergeCellsOutlined,
  PlusOutlined,
  TableOutlined,
} from "@ant-design/icons";
type Props = {
  editor: Editor;
  isInTable: boolean;
  tableState: {
    isHeaderCell: boolean;
    isHeaderRow: boolean;
    isHeaderColumn: boolean;
  };
};

const TableToolbar = ({ editor, isInTable, tableState }: Props) => {
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  return (
    <div className="table-menu-wrapper">
      <button
        type="button"
        className="btn"
        onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
      >
        <TableOutlined />
      </button>

      {isTableMenuOpen && (
        <div className="table-menu">
          <button
            type="button"
            className={`table-toggle ${isInTable ? "is-active" : ""}`}
            onClick={() => {
              if (isInTable) {
                editor.chain().focus().deleteTable().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .insertTable({
                    rows: 3,
                    cols: 3,
                    withHeaderRow: true,
                  })
                  .run();
              }
            }}
          >
            {isInTable ? <DeleteOutlined /> : <PlusOutlined />}{" "}
            <TableOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <PlusOutlined /> <InsertRowLeftOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <PlusOutlined /> <InsertRowAboveOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
          >
            <MergeCellsOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <DeleteOutlined /> <InsertRowLeftOutlined />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <DeleteOutlined /> <InsertRowAboveOutlined />
          </button>

          <button
            type="button"
            className={tableState.isHeaderCell ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          >
            <HighlightOutlined />
          </button>
          <button
            type="button"
            className={tableState.isHeaderRow ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          >
            <HighlightOutlined /> <ArrowRightOutlined />
          </button>
          <button
            type="button"
            className={tableState.isHeaderColumn ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          >
            <HighlightOutlined /> <ArrowDownOutlined />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
