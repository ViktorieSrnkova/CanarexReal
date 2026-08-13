import { useState } from "react";
import type { ListingDetail } from "../types/listings";

const MAX_IMAGES = 11;

interface ImageSelectorProps {
  images: ListingDetail["obrazky"];
  selectedImages: ListingDetail["obrazky"];
  setSelectedImages: (images: ListingDetail["obrazky"]) => void;
}

const useImageSelect = ({
  images,
  setSelectedImages,
  selectedImages,
}: ImageSelectorProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [temporarySelection, setTemporarySelection] = useState<
    ListingDetail["obrazky"]
  >([]);

  const getImageUrl = (id: number) =>
    `${import.meta.env.VITE_API_URL}/api/files/images/${id}`;

  const isSelected = (imageId: number) =>
    temporarySelection.some((image) => image.id === imageId);

  const handleOpenModal = () => {
    setTemporarySelection(selectedImages);
    setModalOpen(true);
  };

  const handleToggleImage = (image: ListingDetail["obrazky"][number]) => {
    if (isSelected(image.id)) {
      setTemporarySelection((current) =>
        current.filter((selected) => selected.id !== image.id),
      );
      return;
    }

    if (temporarySelection.length >= MAX_IMAGES) {
      return;
    }

    setTemporarySelection((current) => [...current, image]);
  };

  const handleConfirm = () => {
    setSelectedImages(temporarySelection);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };
  return {
    isSelected,
    images,
    MAX_IMAGES,
    selectedImages,
    temporarySelection,
    modalOpen,
    handleOpenModal,
    getImageUrl,
    handleCancel,
    handleConfirm,
    handleToggleImage,
  };
};

export default useImageSelect;
