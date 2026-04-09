import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { NewsAdminItem } from "../../types/news";

type Props = {
  record: NewsAdminItem;
  onEdit: (item: NewsAdminItem) => void;
  onDelete: (item: NewsAdminItem) => void;
};

const NewsActions: React.FC<Props> = ({ record, onEdit, onDelete }) => {
  const items = [
    {
      key: "edit",
      label: "Editovat",
      onClick: () => onEdit(record),
    },
    {
      key: "delete",
      label: "Smazat",
      danger: true,
      onClick: () => onDelete(record),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <MoreOutlined style={{ cursor: "pointer", fontSize: 18 }} />
    </Dropdown>
  );
};

export default NewsActions;
