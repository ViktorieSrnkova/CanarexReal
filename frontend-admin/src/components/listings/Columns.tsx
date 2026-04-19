import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  type ListingFilterOption,
  statusOptions,
  type ListingFilters,
  type ListingRow,
} from "../../types/listings";
import { PROPERTY_TYPE_OPTIONS } from "../../types/listing_form";

import { Actions } from "../Actions";
import { Status } from "./TableRow/Status";
import { Visibility } from "./TableRow/Visibility";
import { Language } from "./TableRow/Language";
import { Pictogram } from "./TableRow/Pictograms";
import { formatMoneyEUR } from "../../utils/formatting";
import { Bed, Bath } from "lucide-react";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tooltip } from "antd";

type Args = {
  filters: ListingFilters;
  pictogramOptions: ListingFilterOption[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, value: boolean) => void;
  onChangeStatus: (id: number, statusId: number) => void;
};

const filteredValue = (value?: string) => (value ? [value] : null);

const getSearchFilter = (
  placeholder: string,
  options?: { numeric?: boolean },
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => {
    const value = String(selectedKeys[0] ?? "");

    return (
      <div
        style={{ padding: 8, width: 220 }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Input
          autoFocus
          inputMode={options?.numeric ? "numeric" : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            const nextValue = options?.numeric
              ? event.target.value.replace(/\D/g, "")
              : event.target.value;
            setSelectedKeys(nextValue ? [nextValue] : []);
          }}
          onPressEnter={() => confirm({ closeDropdown: true })}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => confirm({ closeDropdown: true })}
          >
            Filtrovat
          </Button>
          <Button
            size="small"
            onClick={() => {
              setSelectedKeys([]);
              if (clearFilters) {
                clearFilters({ confirm: true, closeDropdown: true });
              } else {
                confirm({ closeDropdown: true });
              }
            }}
          >
            Vymazat
          </Button>
        </Space>
      </div>
    );
  },
  filterIcon: (active: boolean) => (
    <SearchOutlined style={{ color: active ? "#1677ff" : undefined }} />
  ),
});

export function getColumns({
  filters,
  pictogramOptions,
  onEdit,
  onDelete,
  onToggleVisibility,
  onChangeStatus,
}: Args): ColumnsType<ListingRow> {
  return [
    {
      title: "",
      width: 25,
      fixed: "left",
      onCell: () => ({
        style: {
          paddingLeft: 8,
          paddingRight: 4,
        },
      }),
      onHeaderCell: () => ({
        style: {
          paddingLeft: 8,
          paddingRight: 4,
        },
      }),
      render: (_, record) => (
        <Actions<number>
          value={record.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
    {
      key: "index",
      title: "Index",
      dataIndex: "index",
      width: 100,
      filteredValue: filteredValue(filters.index),
      ...getSearchFilter("Filtrovat index", { numeric: true }),
      onCell: () => ({
        style: {
          backgroundColor: "#e6f4ff",
          fontWeight: 600,
        },
      }),
    },
    {
      title: (
        <Tooltip title="Zobrazit na homepage">
          <HomeOutlined />
        </Tooltip>
      ),
      width: 50,
      render: (_, r) => (
        <Visibility
          value={r.reprezentativni}
          onChange={(v: boolean) => onToggleVisibility(r.id, v)}
        />
      ),
      onCell: () => ({
        style: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      }),
    },

    {
      key: "statusIds",
      title: "Status",
      width: 140,
      filters: statusOptions.map((status) => ({
        text: status.label,
        value: status.value,
      })),
      filteredValue: filters.statusIds?.length ? filters.statusIds : null,
      render: (_, r) => (
        <Status
          value={r.status}
          onChange={(statusId: number) => onChangeStatus(r.id, statusId)}
        />
      ),
      onCell: () => ({
        style: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      }),
    },

    {
      key: "typeCodes",
      title: "Typ",
      width: 100,
      filters: PROPERTY_TYPE_OPTIONS.map((type) => ({
        text: type.label,
        value: type.value,
      })),
      filterSearch: true,
      filteredValue: filters.typeCodes?.length ? filters.typeCodes : null,
      render: (_, r) => r.type.label ?? r.type.kod,
    },

    {
      key: "price",
      title: "Cena",
      width: 115,
      dataIndex: "cena_v_eur",
      filteredValue: filteredValue(filters.price),
      ...getSearchFilter("Filtrovat cenu", { numeric: true }),
      render: (value: number) => formatMoneyEUR(value),
    },

    {
      key: "location",
      title: "Lokace",
      width: 150,
      filteredValue: filteredValue(filters.location),
      ...getSearchFilter("Filtrovat lokaci"),
      render: (_, r) => (
        <div
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {r.adresy.lokace}
        </div>
      ),
    },

    {
      key: "bedrooms",
      title: (
        <Tooltip title="Počet ložnic">
          <Bed size={20} />
        </Tooltip>
      ),
      width: 40,
      dataIndex: "loznice",
      filteredValue: filteredValue(filters.bedrooms),
      ...getSearchFilter("Filtrovat ložnice", { numeric: true }),
    },

    {
      key: "bathrooms",
      title: (
        <Tooltip title="Počet koupelen">
          <Bath size={20} />
        </Tooltip>
      ),
      width: 40,
      dataIndex: "koupelny",
      filteredValue: filteredValue(filters.bathrooms),
      ...getSearchFilter("Filtrovat koupelny", { numeric: true }),
    },

    {
      title: (
        <Tooltip title="Velikost v m² ">
          <span> m²</span>
        </Tooltip>
      ),
      width: 70,
      dataIndex: "velikost",
    },
    {
      width: 140,
      title: <span style={{ whiteSpace: "nowrap" }}>CZ | EN | SK</span>,
      render: (_, r) => <Language listing={r} />,
    },
    {
      key: "pictogramIds",
      title: "Piktogramy",
      width: 500,
      filters: pictogramOptions.map((pictogram) => ({
        text: pictogram.label,
        value: pictogram.value,
      })),
      filterSearch: true,
      filteredValue: filters.pictogramIds?.length ? filters.pictogramIds : null,
      render: (_, r) => {
        const items = r.pictograms ?? [];
        const firstRow = items.slice(0, 6);
        const secondRow = items.slice(6, 13);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Pictogram items={firstRow} />
            </div>

            {secondRow.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Pictogram items={secondRow} />
              </div>
            )}
          </div>
        );
      },
    },
  ];
}
