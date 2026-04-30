import { useEffect, useRef, useState } from "react";
import type {
  AddressOption,
  CreateAdFormValues,
  CreateAdPayload,
} from "../types/listing_form";
import type { Language } from "../types/general";
import type { EditorMinimalRef } from "../components/editor/RichMediaEditor";
export const useEditedListing = (
  selectedAddress: AddressOption | null,
  initialData?: CreateAdFormValues,
) => {
  const initialRef = useRef<CreateAdFormValues | null>(null);
  useEffect(() => {
    if (!initialData) return;
    initialRef.current = initialData;
  }, [initialData]);
  const [editorContent, setEditorContent] = useState<
    Record<
      Language,
      { description?: EditorJS.OutputData; details?: EditorJS.OutputData }
    >
  >({
    cs: {},
    en: {},
    sk: {},
  });
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

  const buildEditPayload = async (values: CreateAdFormValues) => {
    const cleanedTranslations: CreateAdPayload["translations"] = {};
    for (const lang of ["cs", "en", "sk"] as const) {
      const base = values.translations?.[lang];
      console.log(descRefs.current[lang]);
      const description = hasContent(editorContent[lang]?.description)
        ? editorContent[lang].description
        : initialRef.current?.translations?.[lang]?.description;

      const details = hasContent(editorContent[lang]?.details)
        ? editorContent[lang].details
        : initialRef.current?.translations?.[lang]?.details;
      const cleaned = {
        title: base?.title,
        description,
        details,
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
    setEditorContent,
  };
};
