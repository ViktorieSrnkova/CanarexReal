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
import { ClearOutlined } from "@ant-design/icons";
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
import { Button, Collapse, Tabs } from "antd";
import "../../components/listings/columns.css";

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
    limit: 200,
    total: 0,
  });
  const [images, setImages] = useState<Gallery[]>([]);
  const SALES_AREAS = ["Tenerife", "Costa del Sol"] as const;
  type SalesArea = (typeof SALES_AREAS)[number];
  const [activeArea, setActiveArea] = useState<SalesArea>("Tenerife");

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
          oblast_prodeje: activeArea,
        });
        console.log("API DATA:", res.data);
        const mapped: ListingRow[] = res.data.map((item) => mapListing(item));
        console.log("MAPPED DATA:", mapped);
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
  }, [pagination.page, pagination.limit, filters, activeArea]);

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
  const countActiveFilters = (filters: ListingFilters) =>
    Object.values(filters).filter((value) =>
      Array.isArray(value)
        ? value.length > 0
        : value !== undefined && value !== null && value !== "",
    ).length;
  const activeFilterCount = countActiveFilters(filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <div className="listings-page">
      <Title level={2}>Spravovat inzeráty</Title>
      <div>Počet inzerátů: {data.length}</div>

      <Collapse
        activeKey={filtersOpen ? ["filters"] : []}
        onChange={(keys) => setFiltersOpen(keys.includes("filters"))}
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
        items={[
          {
            key: "filters",
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>
                    {filtersOpen ? "Sbalit filtry" : "Rozbalit filtry"}
                  </span>

                  {activeFilterCount > 0 && (
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        backgroundColor: "#0c90c5",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <Button
                  type="text"
                  danger
                  icon={<ClearOutlined />}
                  disabled={activeFilterCount === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFiltersChange({});
                  }}
                >
                  Vymazat
                </Button>
              </div>
            ),
            children: (
              <ListingSearchForm
                filters={filters}
                pictogramOptions={pictogramOptions}
                onChange={handleFiltersChange}
              />
            ),
          },
        ]}
      />
      <Tabs
        activeKey={activeArea}
        onChange={(key) => {
          setActiveArea(key as SalesArea);
          setFilters({});
          setPagination((prev) => ({
            ...prev,
            page: 1,
            total: 0,
          }));
        }}
        items={SALES_AREAS.map((area) => ({
          key: area,
          label: area,
        }))}
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
                  filters,
                  oblast_prodeje: activeArea,
                });
                setData(res.data.map(mapListing));

                setPagination((prev) => ({
                  ...prev,
                  total: res.pagination.total,
                }));

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
