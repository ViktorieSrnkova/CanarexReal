import { useEffect, useRef, useState } from "react";
import { Modal, Button, message } from "antd";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Gallery } from "../../types/api";
import { saveGallery } from "../../api/listings";
const LANGS = [
  { id: 2, label: "CZ" },
  { id: 1, label: "EN" },
  { id: 3, label: "SK" },
];
type newImage = {
  tempId: string;
  file: File;
  order: number;
  alts: { lang: number; text: string }[];
};
type existingImage = {
  id: number;
  order: number;
  alts: { lang: number; text: string }[];
};

export type GallerySavePayload = {
  listingId: number;
  existingImages: existingImage[];
  newImages: newImage[];
  removedImageIds: number[];
};
type LocalImage =
  | {
      kind: "existing";
      id: number;
      url: string;
      order: number;
      alts: { lang: number; text: string }[];
    }
  | {
      kind: "new";
      tempId: string;
      file: File;
      url: string;
      order: number;
      alts: { lang: number; text: string }[];
    };

type Props = {
  listingId: number;
  open: boolean;
  onClose: () => void;
  images: Gallery[];
};

export default function ListingGalleryModal({
  open,
  onClose,
  images,
  listingId,
}: Props) {
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const getAlt = (img: LocalImage, langId: number) =>
    img.alts.find((a) => Number(a.lang) === Number(langId))?.text ?? "";
  useEffect(() => {
    if (!images) return;

    setLocalImages(
      images.map((img, index) => ({
        kind: "existing",
        id: img.id,
        url: img.url,
        order: img.order ?? index,
        alts: img.alts.map((a) => ({
          lang: Number(a.lang),
          text: a.text ?? "",
        })),
      })),
    );
  }, [images]);

  const getKey = (img: LocalImage): string =>
    img.kind === "existing" ? `e-${img.id}` : `n-${img.tempId}`;

  const updateAlt = (imageId: string, langId: number, value: string) => {
    setLocalImages((prev) =>
      prev.map((img) => {
        if (getKey(img) !== imageId) return img;

        const exists = img.alts.find((a) => a.lang === langId);

        return {
          ...img,
          alts: exists
            ? img.alts.map((a) =>
                a.lang === langId ? { ...a, text: value } : a,
              )
            : [...img.alts, { lang: langId, text: value }],
        };
      }),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalImages((items) => {
      const oldIndex = items.findIndex((i) => getKey(i) === active.id);
      const newIndex = items.findIndex((i) => getKey(i) === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);

      return reordered.map((img, index) => ({
        ...img,
        order: index,
      }));
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const timeout = setTimeout(() => {
      setUploading(false);
    }, 10000);

    try {
      const newImages: LocalImage[] = Array.from(files).map((file) => ({
        kind: "new",
        tempId: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        order: 0,
        alts: [],
      }));

      await new Promise((res) => setTimeout(res, 600));

      setLocalImages((prev) => {
        const merged = [...prev, ...newImages];

        return merged.map((img, i) => ({
          ...img,
          order: i,
        }));
      });
    } finally {
      clearTimeout(timeout);
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (key: string) => {
    setLocalImages((prev) => {
      const img = prev.find((i) => getKey(i) === key);

      if (img?.kind === "existing") {
        setRemovedImageIds((r) => (r.includes(img.id) ? r : [...r, img.id]));
      }

      return prev.filter((i) => getKey(i) !== key);
    });
  };

  const handleOk = async () => {
    const payload: GallerySavePayload = {
      listingId,
      existingImages: localImages
        .filter(
          (i): i is Extract<LocalImage, { kind: "existing" }> =>
            i.kind === "existing",
        )
        .map((i) => ({
          id: i.id,
          order: i.order,
          alts: i.alts,
        })),

      newImages: localImages
        .filter(
          (i): i is Extract<LocalImage, { kind: "new" }> => i.kind === "new",
        )
        .map((i) => ({
          tempId: i.tempId,
          file: i.file,
          order: i.order,
          alts: i.alts,
        })),
      removedImageIds,
    };
    try {
      await saveGallery(payload);
      console.log("FINAL PAYLOAD:", localImages);
      console.log("FINAL PAYLOAD:", payload);
      message.success("Inzerát upraven");
      onClose();
    } catch (e) {
      message.error("Nepodařilo se upravit inzerát");
      console.error("SAVE GALLERY FAILED", e);
    }
  };

  return (
    <Modal
      title="Upravit galerii"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      width={900}
    >
      <Button
        onClick={() => fileInputRef.current?.click()}
        style={{ marginBottom: 12 }}
        loading={uploading}
        disabled={uploading}
      >
        Přidat obrázek
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={localImages.map(getKey)}
          strategy={rectSortingStrategy}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {localImages
              .filter((img) => img.order !== 0)
              .map((img, index) => (
                <SortableImage
                  key={getKey(img)}
                  image={img}
                  isMain={index === 0}
                  selected={selectedUid === getKey(img)}
                  onDelete={() => removeImage(getKey(img))}
                  onClick={() => setSelectedUid(getKey(img))}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>
      {selectedUid && (
        <div style={{ marginTop: 12 }}>
          {LANGS.map((lang) => {
            const img = localImages.find((i) => getKey(i) === selectedUid);
            if (!img) return null;

            return (
              <div key={lang.id} style={{ marginBottom: 8 }}>
                <label>Alt text {lang.label}</label>
                <input
                  value={getAlt(img, lang.id)}
                  onChange={(e) =>
                    updateAlt(selectedUid, lang.id, e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 4,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
function SortableImage({
  image,
  isMain,
  onDelete,
  onClick,
  selected,
}: {
  image: LocalImage;
  isMain: boolean;
  onDelete: () => void;
  onClick: () => void;
  selected: boolean;
}) {
  const getKey = (img: LocalImage): string =>
    img.kind === "existing" ? `e-${img.id}` : `n-${img.tempId}`;
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: getKey(image) });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        width: 120,
        height: 90,
        position: "relative",
        border: selected ? "3px solid #52c41a" : "1px solid #ddd",
        overflow: "hidden",
        borderRadius: 6,
        cursor: "grab",
      }}
    >
      {isMain && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            background: "#1890ff",
            color: "white",
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          Hlavní
        </div>
      )}
      <img
        src={
          image.url.startsWith("blob:")
            ? image.url
            : `https://canarexreal.onrender.com${image.url}`
        }
        onClick={onClick}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "default",
        }}
      />
      {isMain && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            background: "#1890ff",
            color: "white",
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          Hlavní
        </div>
      )}
      <div
        {...listeners}
        {...attributes}
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          width: 18,
          height: 18,
          background: "rgba(0,0,0,0.5)",
          borderRadius: 4,
          cursor: "grab",
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
