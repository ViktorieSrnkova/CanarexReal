import { useRef } from "react";
import type { EditorMinimalRef } from "../components/editor/RichMediaEditor";
import type {
  AddressOption,
  CreateAdFormValues,
  CreateAdPayload,
  ImageItem,
} from "../types/listing_form";

import type { Language } from "../types/general";

export const useListingSubmit = (
  images: ImageItem[],
  selectedAddress: AddressOption | null,
) => {
  const descRefs = useRef<Record<Language, EditorMinimalRef | null>>({
    cs: null,
    en: null,
    sk: null,
  });

  const detailsRefs = useRef<Record<Language, EditorMinimalRef | null>>({
    cs: null,
    en: null,
    sk: null,
  });

  const hasContent = (data?: EditorJS.OutputData) => !!data?.blocks?.length;

  const buildPayload = async (
    values: CreateAdFormValues,
  ): Promise<CreateAdPayload> => {
    const cleanedTranslations: CreateAdPayload["translations"] = {};

    for (const lang of ["cs", "en", "sk"] as const) {
      const base = values.translations?.[lang];

      const desc = await descRefs.current[lang]?.save();
      const details = await detailsRefs.current[lang]?.save();

      const cleaned = {
        alt: base?.alt,
        title: base?.title,
        description: hasContent(desc) ? desc : undefined,
        details: hasContent(details) ? details : undefined,
      };

      const hasAnyValue =
        cleaned.alt || cleaned.title || cleaned.description || cleaned.details;

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
    descRefs,
    detailsRefs,
    buildPayload,
  };
};
