import { useEffect } from "react";
import type {
  AddressOption,
  CreateAdFormValues,
  CreateAdPayload,
  EditorContentState,
} from "../types/listing_form";
import type { JSONContent } from "@tiptap/react";

export const useEditedListing = (
  selectedAddress: AddressOption | null,
  initialData: CreateAdFormValues | undefined,
  editorContent: EditorContentState,
  setEditorContent: React.Dispatch<React.SetStateAction<EditorContentState>>,
) => {
  useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditorContent({
        cs: {},
        en: {},
        sk: {},
      });
      return;
    }

    setEditorContent({
      cs: {
        description: initialData.translations.cs?.description,
        details: initialData.translations.cs?.details,
      },
      en: {
        description: initialData.translations.en?.description,
        details: initialData.translations.en?.details,
      },
      sk: {
        description: initialData.translations.sk?.description,
        details: initialData.translations.sk?.details,
      },
    });
  }, [initialData, setEditorContent]);

  const hasContent = (data?: JSONContent) => {
    if (!data?.content?.length) return false;

    return data.content.some((node) => {
      if (node.type === "paragraph" && !node.content?.length) {
        return false;
      }

      return true;
    });
  };

  const buildEditPayload = async (values: CreateAdFormValues) => {
    const cleanedTranslations: CreateAdPayload["translations"] = {};

    for (const lang of ["cs", "en", "sk"] as const) {
      const base = values.translations?.[lang];

      const description = hasContent(editorContent[lang].description)
        ? editorContent[lang].description
        : undefined;

      const details = hasContent(editorContent[lang].details)
        ? editorContent[lang].details
        : undefined;

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
      komplex: values.komplex,
      oblast_prodeje: values.oblast_prodeje,
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
    buildEditPayload,
  };
};
