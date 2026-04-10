import { Table, Switch, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import Actions from "./Dropdown";
import type { NewsAdminItem } from "../../types/news";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

type Props = {
  data: NewsAdminItem[];
  onToggle: (id: number) => void;
  onEdit: (item: NewsAdminItem) => void;
  onDelete: (item: NewsAdminItem) => void;
};

const NewsTable: React.FC<Props> = ({ data, onToggle, onEdit, onDelete }) => {
  const truncate = (text: string, max = 10) =>
    text.length > max ? text.slice(0, max) + "..." : text;
  const API_URL = import.meta.env.VITE_API_URL;
  const columns: ColumnsType<NewsAdminItem> = [
    {
      title: "",
      render: (_, record) => (
        <Actions record={record} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
    {
      title: "Viditelné",
      dataIndex: "viditelnost",
      render: (_, record) => (
        <Switch
          checked={record.viditelnost}
          onChange={() => onToggle(record.id)}
        />
      ),
    },
    {
      title: "Obrázek",
      render: (_, r) => {
        const img = r.obrazky?.find((i) => i.poradi === 0);

        if (!img) return "—";

        return <img src={`${API_URL}/api/files/images/${img.id}`} width={80} />;
      },
    },
    {
      title: "CZ titulek",
      render: (_, r) =>
        truncate(
          r.aktuality_preklady.find((p) => p.jazyky_id === 2)?.titulek || "—",
        ),
    },
    {
      title: "EN titulek",
      render: (_, r) =>
        truncate(
          r.aktuality_preklady.find((p) => p.jazyky_id === 1)?.titulek || "—",
        ),
    },
    {
      title: "SK titulek",
      render: (_, r) =>
        truncate(
          r.aktuality_preklady.find((p) => p.jazyky_id === 3)?.titulek || "—",
        ),
    },
    {
      title: "CZ text",
      render: (_, r) => {
        const text = r.aktuality_preklady.find((p) => p.jazyky_id === 2)?.text;
        return text ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        );
      },
    },
    {
      title: "EN text",
      render: (_, r) => {
        const text = r.aktuality_preklady.find((p) => p.jazyky_id === 1)?.text;
        return text ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        );
      },
    },
    {
      title: "SK text",
      render: (_, r) => {
        const text = r.aktuality_preklady.find((p) => p.jazyky_id === 3)?.text;
        return text ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Title style={{ margin: 0 }} level={2}>
          Spravovat aktuality
        </Title>

        <div>Celkem: {data.length} aktualit</div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </>
  );
};

export default NewsTable;
