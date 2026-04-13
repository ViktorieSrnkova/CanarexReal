import { useRef } from "react";
import type { EditorMinimalRef } from "../components/editor/RichMediaEditor";
import type {
  CreateAdFormValues,
  Language,
  Translation,
} from "../types/listings";
import type { ImageItem } from "./useImages";

export const useListingSubmit = (images: ImageItem[]) => {
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

  const isEmpty = (data?: EditorJS.OutputData) =>
    !data || data.blocks.length === 0;

  const buildPayload = async (values: CreateAdFormValues) => {
    const cleanedTranslations: Partial<Record<Language, Translation>> = {};

    for (const lang of ["cs", "en", "sk"] as Language[]) {
      const base = values.translations?.[lang];

      const desc = await descRefs.current[lang]?.save();
      const details = await detailsRefs.current[lang]?.save();

      const cleaned: Translation = { ...base };

      if (!isEmpty(desc)) cleaned.description = desc;
      if (!isEmpty(details)) cleaned.details = details;

      const hasAnyValue =
        cleaned.alt || cleaned.title || cleaned.description || cleaned.details;

      if (hasAnyValue) {
        cleanedTranslations[lang] = cleaned;
      }
    }

    return {
      ...values,
      translations: cleanedTranslations,
      images: images.map((img, index) => ({
        file: img.file,
        order: index,
      })),
    };
  };

  return {
    descRefs,
    detailsRefs,
    buildPayload,
  };
};
