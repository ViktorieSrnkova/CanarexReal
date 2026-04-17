import type { ColumnsType } from "antd/es/table";
import type { ListingRow } from "../../types/listings";

import { Actions } from "../Actions";
import { Status } from "./TableRow/Status";
import { Visibility } from "./TableRow/Visibility";
import { Language } from "./TableRow/Language";
import { Pictogram } from "./TableRow/Pictograms";
import { formatMoneyEUR } from "../../utils/formatting";
import { Bed, Bath } from "lucide-react";
import { HomeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

type Args = {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, value: boolean) => void;
  onChangeStatus: (id: number, statusId: number) => void;
};

export function getColumns({
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
      title: "Index",
      dataIndex: "index",
      width: 100,
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
      title: "Status",
      width: 140,
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
      title: "Typ",
      width: 100,
      render: (_, r) => r.type.label ?? r.type.kod,
    },

    {
      title: "Cena",
      width: 115,
      dataIndex: "cena_v_eur",
      render: (value: number) => formatMoneyEUR(value),
    },

    {
      title: "Lokace",
      width: 150,
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
      title: (
        <Tooltip title="Počet ložnic">
          <Bed size={20} />
        </Tooltip>
      ),
      width: 40,
      dataIndex: "loznice",
    },

    {
      title: (
        <Tooltip title="Počet koupelen">
          <Bath size={20} />
        </Tooltip>
      ),
      width: 40,
      dataIndex: "koupelny",
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
      title: "CZ | EN | SK",
      render: (_, r) => <Language listing={r} />,
    },
    {
      title: "Piktogramy",
      width: 500,
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
