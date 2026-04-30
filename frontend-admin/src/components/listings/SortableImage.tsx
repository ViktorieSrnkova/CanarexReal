import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ImageItem } from "../../types/listing_form";

type Props = {
  id: string;
  image: ImageItem;
  isMain: boolean;
  onDelete?: () => void;
};

const SortableImage: React.FC<Props> = ({ id, image, isMain, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        position: "relative",
        width: 120,
        height: 120,
        border: isMain ? "3px solid #1890ff" : "1px solid #ccc",
        borderRadius: 6,
        overflow: "hidden",
        transform: CSS.Transform.toString(transform),
        transition,
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
        src={image.url}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          cursor: "default",
        }}
      />
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
      {!isMain && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: 4,
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SortableImage;
