import { CSS } from "@dnd-kit/utilities";
import type { ListingDetail } from "../../types/listings";
import { HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";

interface SortableImageProps {
  image: ListingDetail["obrazky"][number];
  getImageUrl: (id: number) => string;
}

export const SortableImage = ({ image, getImageUrl }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="image-selector-preview" style={style}>
      <img src={getImageUrl(image.id)} alt="" />

      <button
        type="button"
        className="image-drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Přesunout fotografii"
      >
        <HolderOutlined />
      </button>
    </div>
  );
};
