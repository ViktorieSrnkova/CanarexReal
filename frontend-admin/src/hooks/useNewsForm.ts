import { useState } from "react";
import { message } from "antd";
import type {
  NewsFormState,
  NewsFormValues,
  NewsEditorContent,
} from "../types/news";
import type { Language } from "../types/general";
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
  ): NewsPayload => {
    return {
      visible: values.visible,
      translations: Object.fromEntries(
        (Object.keys(values.translations) as Language[]).map((lang) => [
          lang,
          {
            title: values.translations[lang]?.title ?? "",
            text: editorContent[lang] ?? null,
            alt: values.translations[lang]?.alt ?? "",
          },
        ]),
      ),
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
