import { Table } from "antd";
import { getColumns } from "./Columns";
import type { ListingRow } from "../../types/listings";

type Props = {
  data: ListingRow[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, value: boolean) => void;
  onChangeStatus: (id: number, statusId: number) => void;
  onPaginationChange: (page: number, limit: number) => void;
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export function ListingTable({
  data,
  loading,
  pagination,
  onPaginationChange,
  onEdit,
  onDelete,
  onToggleVisibility,
  onChangeStatus,
}: Props) {
  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={getColumns({
        onEdit,
        onDelete,
        onToggleVisibility,
        onChangeStatus,
      })}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page, pageSize) => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          onPaginationChange(page, pageSize);
        },
      }}
      scroll={{ x: true }}
    />
  );
}
