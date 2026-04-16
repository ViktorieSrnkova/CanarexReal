import { Select } from "antd";
import type { ListingStatus } from "../../../types/listings";

type Props = {
  value: ListingStatus;
  onChange: (statusId: number) => void;
};

export function Status({ value, onChange }: Props) {
  return (
    <Select
      value={value.id}
      onChange={onChange}
      style={{ width: 140 }}
      options={[
        { value: 1, label: "NA PRODEJ" },
        { value: 2, label: "PRODÁNO" },
        { value: 3, label: "REZERVOVÁNO" },
      ]}
    />
  );
}
