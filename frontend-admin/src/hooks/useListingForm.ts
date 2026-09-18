import type {
  AddressOption,
  CreateAdFormValues,
  CreateAdPayload,
  EditorContentState,
  ImageItem,
} from "../types/listing_form";

import type { JSONContent } from "@tiptap/react";

export const useListingSubmit = (
  images: ImageItem[],
  selectedAddress: AddressOption | null,
  editorContent: EditorContentState,
) => {
  const hasContent = (data?: JSONContent) => {
    if (!data?.content?.length) {
      return false;
    }

    return data.content.some((node) => {
      if (node.type === "paragraph" && !node.content?.length) {
        return false;
      }

      return true;
    });
  };

  const buildPayload = async (
    values: CreateAdFormValues,
  ): Promise<CreateAdPayload> => {
    const cleanedTranslations: CreateAdPayload["translations"] = {};

    for (const lang of ["cs", "en", "sk"] as const) {
      const base = values.translations?.[lang];

      const descEditor = editorContent[lang]?.description;
      const detailsEditor = editorContent[lang]?.details;

      const cleaned = {
        title: base?.title,
        description: hasContent(descEditor) ? descEditor : undefined,
        details: hasContent(detailsEditor) ? detailsEditor : undefined,
      };

      const hasAnyValue =
        cleaned.title || cleaned.description || cleaned.details;

      if (hasAnyValue) {
        cleanedTranslations[lang] = cleaned;
      }
    }

    return {
      index: Number(values.listingIndex),
      price: Number(values.price),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      size: Number(values.area),
      location: values.locationName,
      propertyType: values.propertyType,
      showOnHomepage: values.isOnHomepage,
      komplex: values.komplex,
      oblast_prodeje: values.oblast_prodeje,
      attributes: values.features ?? {},

      translations: cleanedTranslations,

      images: images.map((_, index) => ({
        order: index,
      })),

      address: selectedAddress
        ? {
            value: selectedAddress.value,
            label: selectedAddress.label,
            lat: selectedAddress.lat,
            lon: selectedAddress.lon,
          }
        : null,
    };
  };

  return {
    buildPayload,
  };
};
