import { Button, Empty, Modal, Typography } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import type { ListingDetail } from "../../types/listings";
import useImageSelect from "../../hooks/useImageSelect";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import "./ImageSelector.css";
import { SortableImage } from "./SortableImage";
import { restrictToParentElement } from "@dnd-kit/modifiers";

const { Text } = Typography;

interface ImageSelectorProps {
  images: ListingDetail["obrazky"];
  selectedImages: ListingDetail["obrazky"];
  setSelectedImages: (images: ListingDetail["obrazky"]) => void;
}
const ImageSelector = ({
  images,
  selectedImages,
  setSelectedImages,
}: ImageSelectorProps) => {
  const {
    temporarySelection,
    modalOpen,
    MAX_IMAGES,
    handleOpenModal,
    getImageUrl,
    handleCancel,
    isSelected,
    handleConfirm,
    handleToggleImage,
  } = useImageSelect({ images, selectedImages, setSelectedImages });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = selectedImages.findIndex(
      (image) => image.id === Number(active.id),
    );

    const newIndex = selectedImages.findIndex(
      (image) => image.id === Number(over.id),
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    setSelectedImages(arrayMove(selectedImages, oldIndex, newIndex));
  };
  return (
    <div>
      <div className="image-selector-header">
        <div>
          <Text strong>Fotografie</Text>

          <Text type="secondary" style={{ marginLeft: 8 }}>
            {selectedImages.length} / {MAX_IMAGES} vybráno
          </Text>
        </div>

        <Button icon={<EditOutlined />} onClick={handleOpenModal}>
          Upravit výběr
        </Button>
      </div>

      {selectedImages.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={selectedImages.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <div className="image-selector-preview-container">
              {selectedImages.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  getImageUrl={getImageUrl}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <Empty description="Nejsou vybrané žádné fotografie" />
      )}

      <Modal
        title={
          <div>
            <div>Vyber fotografie</div>

            <Text type="secondary">
              {temporarySelection.length} / {MAX_IMAGES} vybráno
            </Text>
          </div>
        }
        open={modalOpen}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Potvrdit výběr"
        cancelText="Zrušit"
        width={900}
      >
        <div className="image-selector-grid">
          {images.map((image) => {
            const selected = isSelected(image.id);
            const disabled =
              !selected && temporarySelection.length >= MAX_IMAGES;

            return (
              <button
                className="image-selector-button"
                key={image.id}
                type="button"
                onClick={() => handleToggleImage(image)}
                disabled={disabled}
                style={{
                  border: selected
                    ? "3px solid #1677ff"
                    : "3px solid transparent",

                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.45 : 1,
                  touchAction: "none",
                }}
              >
                <img src={getImageUrl(image.id)} alt="" />

                {selected && (
                  <div className="mobile-check-icon">
                    <CheckOutlined />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default ImageSelector;
