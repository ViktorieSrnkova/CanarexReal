import { Table, type TableProps } from "antd";
import type { FilterValue } from "antd/es/table/interface";
import { getColumns } from "./Columns";
import type {
  ListingRow,
  ListingFilterOption,
  ListingFilters,
} from "../../types/listings";
import {
  PROPERTY_TYPE_OPTIONS,
  type PropertyType,
} from "../../types/listing_form";

type Props = {
  data: ListingRow[];
  filters: ListingFilters;
  pictogramOptions: ListingFilterOption[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, value: boolean) => void;
  onChangeStatus: (id: number, statusId: number) => void;
  onFiltersChange: (filters: ListingFilters) => void;
  onPaginationChange: (page: number, limit: number) => void;
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

const firstFilterValue = (value: FilterValue | null | undefined) => {
  const rawValue = value?.[0];
  if (rawValue === undefined || rawValue === null) return undefined;

  const text = String(rawValue).trim();
  return text || undefined;
};

const parseStatusIds = (value: FilterValue | null | undefined) =>
  (value ?? [])
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item));

const parsePropertyTypeCodes = (
  value: FilterValue | null | undefined,
): PropertyType[] =>
  (value ?? [])
    .map((item) => String(item))
    .filter((item): item is PropertyType =>
      PROPERTY_TYPE_OPTIONS.some((option) => option.value === item),
    );

const normalizeFilters = (
  tableFilters: Record<string, FilterValue | null>,
  currentFilters: ListingFilters,
): ListingFilters => {
  const statusIds = parseStatusIds(tableFilters.statusIds);
  const typeCodes = parsePropertyTypeCodes(tableFilters.typeCodes);
  const pictogramIds = parseStatusIds(tableFilters.pictogramIds);

  return {
    query: currentFilters.query,
    index: firstFilterValue(tableFilters.index),
    statusIds: statusIds.length ? statusIds : undefined,
    typeCodes: typeCodes.length ? typeCodes : undefined,
    price: firstFilterValue(tableFilters.price),
    location: firstFilterValue(tableFilters.location),
    bedrooms: firstFilterValue(tableFilters.bedrooms),
    bathrooms: firstFilterValue(tableFilters.bathrooms),
    pictogramIds: pictogramIds.length ? pictogramIds : undefined,
  };
};

export function ListingTable({
  data,
  filters,
  pictogramOptions,
  loading,
  pagination,
  onPaginationChange,
  onFiltersChange,
  onEdit,
  onDelete,
  onToggleVisibility,
  onChangeStatus,
}: Props) {
  const handleTableChange: TableProps<ListingRow>["onChange"] = (
    _pagination,
    tableFilters,
    _sorter,
    extra,
  ) => {
    if (extra.action !== "filter") return;

    onFiltersChange(normalizeFilters(tableFilters, filters));
  };
  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={getColumns({
        filters,
        pictogramOptions,
        onEdit,
        onDelete,
        onToggleVisibility,
        onChangeStatus,
      })}
      onChange={handleTableChange}
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
