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
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useSensor, useSensors } from "@dnd-kit/core";

import { reorderListings } from "../../api/listings";
import { useEffect, useRef, useState } from "react";
import { SortableRow } from "../dashboard/SortableRow";
import { DragOverlay } from "@dnd-kit/core";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GhostRow } from "./TableRow/GhostRow";
import "../../styles/drag.css";

type Props = {
  data: ListingRow[];
  filters: ListingFilters;
  pictogramOptions: ListingFilterOption[];
  onEdit: (id: number) => void;
  onGalleryEdit: (id: number) => void;
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

const parseRangeFilter = (value: FilterValue | null | undefined) => {
  const text = firstFilterValue(value);
  if (!text) return {};

  const [from, to] = text.split(":");

  return {
    from: from || undefined,
    to: to || undefined,
  };
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
  const priceRange = parseRangeFilter(tableFilters.price);
  const sizeRange = parseRangeFilter(tableFilters.size);
  const bedroomsRange = parseRangeFilter(tableFilters.bedrooms);
  const bathroomsRange = parseRangeFilter(tableFilters.bathrooms);

  return {
    query: currentFilters.query,
    index: firstFilterValue(tableFilters.index),
    statusIds: statusIds.length ? statusIds : undefined,
    typeCodes: typeCodes.length ? typeCodes : undefined,
    priceFrom: priceRange.from,
    priceTo: priceRange.to,
    sizeFrom: sizeRange.from,
    sizeTo: sizeRange.to,
    location: firstFilterValue(tableFilters.location),
    bedroomsFrom: bedroomsRange.from,
    bedroomsTo: bedroomsRange.to,
    bathroomsFrom: bathroomsRange.from,
    bathroomsTo: bathroomsRange.to,
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
  onGalleryEdit,
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

  const [tableData, setTableData] = useState(data);
  const [activeId, setActiveId] = useState<number | null>(null);
  const overId = useRef<number | null>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(Number(active.id));
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tableData.findIndex(
      (item) => item.id === Number(active.id),
    );

    const newIndex = tableData.findIndex((item) => item.id === Number(over.id));

    const newData = arrayMove(tableData, oldIndex, newIndex);

    setTableData(newData);

    try {
      const newPoradi = pagination.total - newIndex;

      await reorderListings(Number(active.id), newPoradi);
    } catch (err) {
      console.error(err);
      setTableData(data);
    }
  };
  const canReorder =
    !filters.query &&
    !filters.index &&
    !filters.location &&
    !filters.priceFrom &&
    !filters.priceTo &&
    !filters.sizeFrom &&
    !filters.sizeTo &&
    !filters.bedroomsFrom &&
    !filters.bedroomsTo &&
    !filters.bathroomsFrom &&
    !filters.bathroomsTo &&
    !filters.statusIds?.length &&
    !filters.typeCodes?.length &&
    !filters.pictogramIds?.length;
  const columns = getColumns({
    filters,
    pictogramOptions,
    onEdit,
    onGalleryEdit,
    onDelete,
    onToggleVisibility,
    onChangeStatus,
    canReorder,
  });

  const setDraggingCursor = (value: string) => {
    document.documentElement.style.cursor = value;
    document.body.style.cursor = value;
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        setDraggingCursor("grabbing");
        handleDragStart(event);
      }}
      onDragOver={({ over }) => {
        document
          .querySelectorAll(".drag-over-row")
          .forEach((el) => el.classList.remove("drag-over-row"));

        if (!over) return;

        const row = document.querySelector(`[data-row-key="${over.id}"]`);

        row?.classList.add("drag-over-row");
      }}
      onDragCancel={() => {
        setDraggingCursor("");
        setActiveId(null);
      }}
      onDragEnd={(event) => {
        setDraggingCursor("");
        setActiveId(null);

        handleDragEnd(event);
      }}
    >
      <SortableContext
        items={tableData.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          rowKey="id"
          dataSource={tableData}
          size="small"
          columns={columns}
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
          components={{
            body: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              row: (props: any) => (
                <SortableRow {...props} activeId={activeId} overId={overId} />
              ),
            },
          }}
          scroll={{ x: true }}
        />
        <DragOverlay modifiers={[restrictToVerticalAxis]}>
          {activeId ? (
            <GhostRow
              record={data.find((x) => x.id === activeId)!}
              columns={columns}
            />
          ) : null}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );
}
