import { useState } from "react";
import { message } from "antd";
import type {
  NewsFormState,
  NewsFormValues,
  NewsEditorContent,
} from "../types/news";
import { uploadMedia } from "../services/mediaService";
import type { NewsPayload } from "../api/news";

export const useNewsForm = () => {
  const [data, setData] = useState<NewsFormState>({
    uploading: false,
    pickingImage: false,
  });

  const createPayload = (
    values: NewsFormValues,
    editorContent: NewsEditorContent,
    initialValues?: NewsFormValues,
  ): NewsPayload => {
    const translations = {} as NewsPayload["translations"];

    for (const lang of ["cs", "en", "sk"] as const) {
      const current = values.translations?.[lang];
      const original = initialValues?.translations?.[lang];

      translations[lang] = {
        title: current?.title ?? original?.title ?? "",
        text: editorContent[lang] ?? null,
        alt: current?.alt ?? original?.alt ?? "",
      };
    }

    return {
      visible: values.visible,
      translations,
      mainImageId: data.mainImageId,
      existingImageId: data.existingImageId,
    };
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Můžete nahrát pouze obrázek");
      return false;
    }

    setData((prev) => ({
      ...prev,
      uploading: true,
      pickingImage: false,
    }));

    try {
      const uploaded = await uploadMedia(file, "news");

      setData((prev) => ({
        ...prev,
        imagePreview: `${import.meta.env.VITE_API_URL}/api/files/images/${uploaded.id}`,
        mainImageId: uploaded.id,
        existingImageId: undefined,
        existingImageUrl: undefined,
      }));
    } catch (error) {
      console.error("News main image upload failed:", error);
      message.error("Nepodařilo se nahrát hlavní obrázek");

      setData((prev) => ({
        ...prev,
        uploading: false,
      }));
    } finally {
      setData((prev) => ({
        ...prev,
        uploading: false,
      }));
    }

    return false;
  };

  const handleImageCancel = () => {
    setData((prev) => ({
      ...prev,
      pickingImage: false,
    }));
  };
  const resetImage = () => {
    setData({
      uploading: false,
      pickingImage: false,
    });
  };

  return {
    data,
    setData,
    createPayload,
    handleImageUpload,
    handleImageCancel,
    handleImageClick: () =>
      setData((prev) => ({
        ...prev,
        pickingImage: true,
      })),
    resetImage,
  };
};
