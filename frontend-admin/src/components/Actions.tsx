import { Dropdown, type MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";

type Props<T> = {
  value: T;
  onEdit: (value: T) => void;
  onDelete: (value: T) => void;
};

export function Actions<T>({ value, onEdit, onDelete }: Props<T>) {
  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Editovat",
      onClick: () => onEdit(value),
    },
    {
      key: "delete",
      label: "Smazat",
      danger: true,
      onClick: () => onDelete(value),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <MoreOutlined style={{ cursor: "pointer", fontSize: 18 }} />
    </Dropdown>
  );
}

export default Actions;
