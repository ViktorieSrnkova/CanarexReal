import { useEffect, useState } from "react";
import { getAdminNews, deleteNews, toggleNewsVisibility } from "../../api/news";
import NewsTable from "../../components/news/Table";
import DeleteConfirmModal from "../../components/DeleteModal";
import type { NewsAdminItem } from "../../types/news";
import Title from "antd/es/typography/Title";
import { EditModal } from "../../components/EditModal";
import NewsCreatePage from "./NewsCreatePage";

const AdminNewsPage = () => {
  const [data, setData] = useState<NewsAdminItem[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<NewsAdminItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAdminNews();
      setData(res);
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteNews(selected.id);
    setDeleteOpen(false);
  };
  useEffect(() => {
    if (!deleteOpen) {
      const fetchData = async () => {
        const res = await getAdminNews();
        setData(res);
      };
      fetchData();
    }
  }, [deleteOpen]);
  return (
    <>
      <Title level={2}>Spravovat aktuality</Title>
      <div>Celkem aktualit: {data.length}</div>
      <NewsTable
        data={data}
        onToggle={async (id) => {
          await toggleNewsVisibility(id);
          const res = await getAdminNews();
          setData(res);
        }}
        onEdit={(item) => {
          setSelected(item);
          setEditOpen(true);
        }}
        onDelete={(item) => {
          setSelected(item);
          setDeleteOpen(true);
        }}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <EditModal<NewsAdminItem>
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={selected}
      >
        {({ data, onSuccess }) => (
          <NewsCreatePage
            initialData={data}
            onSuccess={async () => {
              setEditOpen(false);
              const res = await getAdminNews();
              setData(res);
              onSuccess?.();
            }}
          />
        )}
      </EditModal>
    </>
  );
};

export default AdminNewsPage;
