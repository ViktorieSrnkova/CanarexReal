import { Table } from "antd";
import type { ListingRow } from "../../../types/listings";
import type { ColumnsType } from "antd/es/table";

export function GhostRow({
  record,
  columns,
}: {
  record: ListingRow;
  columns: ColumnsType<ListingRow>;
}) {
  return (
    <div
      className="drag-ghost"
      style={{
        width: "100%",
        pointerEvents: "none",
        cursor: "grabbing",
        opacity: 0.85,
      }}
    >
      <Table
        size="small"
        columns={columns}
        dataSource={[record]}
        rowKey="id"
        pagination={false}
        showHeader={false}
        scroll={{ x: true }}
        style={{
          cursor: "grabbing",
        }}
      />
    </div>
  );
}
