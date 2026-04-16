import { Tooltip } from "antd";
import type { ListingPictogram } from "../../../types/listings";

type Props = {
  items: ListingPictogram[];
};

export function Pictogram({ items }: Props) {
  if (!items?.length) return <span style={{ color: "#999" }}>—</span>;

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {items.map((p) => (
        <Tooltip key={p.id} title={p.label ?? p.code}>
          <span
            style={{
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 4,
              background: "#f5f5f5",
              whiteSpace: "nowrap",
            }}
          >
            {p.label ?? p.code}
          </span>
        </Tooltip>
      ))}
    </div>
  );
}
