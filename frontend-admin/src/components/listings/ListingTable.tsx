import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getColumns } from "./Columns";
import type { ListingRow } from "../../types/listings";

type Props = {
  data: ListingRow[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, value: boolean) => void;
  onChangeStatus: (id: number, statusId: number) => void;
};

export function ListingTable({
  data,
  onEdit,
  onDelete,
  onToggleVisibility,
  onChangeStatus,
}: Props) {
  const columns: ColumnsType<ListingRow> = getColumns({
    onEdit,
    onDelete,
    onToggleVisibility,
    onChangeStatus,
  });

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      pagination={false}
      scroll={{ x: true }}
    />
  );
}
