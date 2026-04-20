import { useRef } from "react";
import type {
  AddressOption,
  CreateAdFormValues,
  CreateAdPayload,
} from "../types/listing_form";
import type { Language } from "../types/general";
import type { EditorMinimalRef } from "../components/editor/RichMediaEditor";
export const useEditedListing = (selectedAddress: AddressOption | null) => {
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

  const buildEditPayload = async (values: CreateAdFormValues) => {
    const cleanedTranslations: CreateAdPayload["translations"] = {};
    for (const lang of ["cs", "en", "sk"] as const) {
      const base = values.translations?.[lang];
      console.log(descRefs.current[lang]);
      const desc = await descRefs.current[lang]?.save();
      const details = await detailsRefs.current[lang]?.save();

      const cleaned = {
        alt: base?.alt,
        title: base?.title,
        description: desc?.blocks?.length ? desc : undefined,
        details: details?.blocks?.length ? details : undefined,
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
      attributes: values.features ?? {},
      translations: cleanedTranslations,
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
    buildEditPayload,
  };
};
