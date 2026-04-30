import React, { useEffect, useState } from "react";
import {
  type ListingFilterOption,
  statusOptions,
  type ListingFilters,
  type ListingRow,
} from "../../types/listings";
import { ListingTable } from "../../components/listings/ListingTable";
import { ListingSearchForm } from "../../components/listings/ListingSearchForm";
import { mapListing } from "../../utils/mapListing";
import {
  deleteListing,
  getListingFilterOptions,
  getListingById,
  getListings,
  patchListingStatus,
  patchListingVisibility,
  getGalery,
} from "../../api/listings";
import Title from "antd/es/typography/Title";
import DeleteConfirmModal from "../../components/DeleteModal";
import ListingCreatePage from "./ListingCreatePage";
import { EditModal } from "../../components/EditModal";
import type { CreateAdFormValues } from "../../types/listing_form";
import { mapRawListingToFormValues } from "../../utils/listingsMapper";
import LoadingPage from "../system/LoadingPage";
import ListingGalleryModal from "../../components/listings/GalleryModal";
import type { Gallery } from "../../types/api";

const ListingsPage: React.FC = () => {
  const [data, setData] = useState<ListingRow[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [listingId, setListingId] = useState<number | undefined>();
  const [pictogramOptions, setPictogramOptions] = useState<
    ListingFilterOption[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingVisibilityIds, setUpdatingVisibilityIds] = useState<number[]>(
    [],
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [images, setImages] = useState<Gallery[]>([]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const res = await getListingFilterOptions();
        setPictogramOptions(res.pictograms);
      } catch (err) {
        console.error("Failed to load listing filter options:", err);
      }
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setData([]);
        const res = await getListings({
          page: pagination.page,
          limit: pagination.limit,
          filters,
        });

        const mapped: ListingRow[] = res.data.map((item) => mapListing(item));

        setData(mapped);

        setPagination((prev) => ({
          ...prev,
          total: res.pagination.total,
        }));
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [pagination.page, pagination.limit, filters]);

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
  const handleFiltersChange = (nextFilters: ListingFilters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<CreateAdFormValues | null>(null);

  const handleEdit = async (id: number) => {
    try {
      const res = await getListingById(id);
      const mapped = mapRawListingToFormValues(res);

      setSelected(mapped);
      setEditOpen(true);
    } catch (err) {
      console.error("Failed to load listing detail:", err);
    }
  };
  const handleGalleryEdit = async (id: number) => {
    try {
      const res = await getGalery(id);
      console.log(res);
      setImages(res);
      setGalleryOpen(true);
      setListingId(id);
    } catch (err) {
      console.error("Failed to load listing detail gallery:", err);
    }
  };

  return (
    <div className="listings-page">
      <Title level={2}>Spravovat inzeráty</Title>
      <div>Celkem inzerátů: {data.length}</div>
      <ListingSearchForm
        filters={filters}
        pictogramOptions={pictogramOptions}
        onChange={handleFiltersChange}
      />
      <ListingTable
        data={data}
        filters={filters}
        pictogramOptions={pictogramOptions}
        onEdit={handleEdit}
        onGalleryEdit={handleGalleryEdit}
        onDelete={handleDeleteClick}
        onToggleVisibility={handleToggleVisibility}
        onChangeStatus={handleChangeStatus}
        onFiltersChange={handleFiltersChange}
        loading={loading}
        pagination={pagination}
        onPaginationChange={(page, limit) => {
          setPagination({ page, limit, total: pagination.total });
        }}
      />
      <DeleteConfirmModal
        open={deleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
      />
      {editOpen && selected && (
        <EditModal<CreateAdFormValues>
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelected(null);
          }}
          initialData={selected}
        >
          {({ data, onSuccess }) => (
            <ListingCreatePage
              key={selected?.listingIndex ?? "edit"}
              initialData={data}
              onClose={() => setEditOpen(false)}
              onSuccess={async () => {
                setEditOpen(false);
                const res = await getListings({
                  page: pagination.page,
                  limit: pagination.limit,
                });

                setData(res.data.map(mapListing));
                onSuccess?.();
              }}
            />
          )}
        </EditModal>
      )}
      {galleryOpen && listingId && (
        <ListingGalleryModal
          listingId={listingId}
          open={galleryOpen}
          onClose={() => {
            setGalleryOpen(false);
            setSelected(null);
          }}
          images={images}
        />
      )}

      {loading && <LoadingPage />}
    </div>
  );
};

export default ListingsPage;
