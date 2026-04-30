import { Dropdown, type MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";

type Props<T> = {
  value: T;
  onEdit?: (value: T) => void;
  onDelete: (value: T) => void;
  onEditTexts?: (value: T) => void;
  onEditGallery?: (value: T) => void;
};

export function Actions<T>({
  value,
  onEdit,
  onDelete,
  onEditTexts,
  onEditGallery,
}: Props<T>) {
  const items: MenuProps["items"] = [
    ...(onEdit
      ? [
          {
            key: "edit",
            label: "Editovat",
            onClick: () => onEdit(value),
          },
        ]
      : []),
    ...(onEditTexts
      ? [
          {
            key: "edit-texts",
            label: "Editovat texty",
            onClick: () => onEditTexts(value),
          },
        ]
      : []),
    ...(onEditGallery
      ? [
          {
            key: "edit-gallery",
            label: "Upravit galerii",
            onClick: () => onEditGallery(value),
          },
        ]
      : []),
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
