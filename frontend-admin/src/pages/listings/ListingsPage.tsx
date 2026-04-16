import React, { useEffect, useState } from "react";
import { statusOptions, type ListingRow } from "../../types/listings";
import { ListingTable } from "../../components/listings/ListingTable";
import { mapListing } from "../../utils/mapListing";
import type { RawListing } from "../../types/api";
import {
  deleteListing,
  getListings,
  patchListingStatus,
  patchListingVisibility,
} from "../../api/listings";
import Title from "antd/es/typography/Title";
import DeleteConfirmModal from "../../components/DeleteModal";

const ListingsPage: React.FC = () => {
  const [data, setData] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingVisibilityIds, setUpdatingVisibilityIds] = useState<number[]>(
    [],
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);

        const res = await getListings();

        const mapped: ListingRow[] = res.data.map((item: RawListing) =>
          mapListing(item),
        );

        setData(mapped);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);
  const handleChangeStatus = async (id: number, statusId: number) => {
    try {
      await patchListingStatus(id, statusId);

      const newStatus = statusOptions.find((s) => s.value === statusId);

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: {
                  id: statusId,
                  label: newStatus?.label ?? null,
                },
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };
  const handleToggleVisibility = async (id: number, value: boolean) => {
    if (updatingVisibilityIds.includes(id)) return;

    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, reprezentativni: value } : item,
      ),
    );

    setUpdatingVisibilityIds((prev) => [...prev, id]);

    try {
      await patchListingVisibility(id, value);
    } catch (err) {
      console.error("Visibility update failed:", err);

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, reprezentativni: !value } : item,
        ),
      );
    } finally {
      setUpdatingVisibilityIds((prev) => prev.filter((x) => x !== id));
    }
  };
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteListing(deleteId);

      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };
  return (
    <div className="listings-page">
      <Title level={2}>Spravovat inzeráty</Title>
      <div>Celkem inzerátů: {data.length}</div>

      <ListingTable
        data={data}
        onEdit={(id) => console.log("edit", id)}
        onDelete={handleDeleteClick}
        onToggleVisibility={handleToggleVisibility}
        onChangeStatus={handleChangeStatus}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />

      {loading && <p style={{ marginTop: 12 }}>Loading listings...</p>}
    </div>
  );
};

export default ListingsPage;
