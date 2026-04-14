import { useState, useRef, useEffect } from "react";
import type EditorJS from "@editorjs/editorjs";
import type {
  NewsFormValues,
  Lang,
  NewsFormState,
  Translation,
} from "../types/news";
import { postNews, putAdminNews } from "../api/news";
import { message } from "antd";
import type { EditorContent, EditorBlock } from "../types/editor";
import { hydrateImages, safeParseEditor } from "../utils/editor";

const defaultTranslations: Record<Lang, Translation> = {
  cs: { title: "", text: "", alt: "" },
  en: { title: "", text: "", alt: "" },
  sk: { title: "", text: "", alt: "" },
};

export const useNewsForm = (editId?: number, onSuccess?: () => void) => {
  const [data, setData] = useState<NewsFormState>({
    translations: defaultTranslations,
  });
  const editorRef = useRef<EditorJS | null>(null);
  const [activeLang, setActiveLang] = useState<Lang | null>(null);
  const [titleModal, setTitleModal] = useState(false);
  const [editorModal, setEditorModal] = useState(false);
  const [altModal, setAltModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [altInput, setAltInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const openModal = (type: "title" | "alt" | "editor", lang: Lang) => {
    setActiveLang(lang);

    if (type === "title") {
      setTitleInput(data.translations[lang]?.title ?? "");
      setTitleModal(true);
    }

    if (type === "alt") {
      setAltInput(data.translations[lang]?.alt ?? "");
      setAltModal(true);
    }

    if (type === "editor") {
      setEditorModal(true);
    }
  };

  useEffect(() => {
    if (!editorModal || !activeLang) return;
    if (!editorRef.current || !editorReady) return;

    const saved = data.translations[activeLang]?.text;
    const parsed = safeParseEditor(saved);
    const hydrated = hydrateImages(parsed);

    editorRef.current.render(hydrated);
  }, [editorModal, activeLang, editorReady]);

  const saveTitle = () => {
    if (!activeLang) return;

    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: {
          ...(prev.translations[activeLang] ?? {}),
          title: titleInput,
        },
      },
    }));

    setTitleModal(false);
  };

  const saveAltText = () => {
    if (!activeLang) return;

    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: {
          ...(prev.translations[activeLang] ?? {}),
          alt: altInput,
        },
      },
    }));

    setAltModal(false);
  };

  const saveEditorText = async () => {
    if (!editorRef.current || !activeLang) return;
    const content = await editorRef.current.save();
    const isEmpty = content.blocks.length === 0;
    const cleaned: EditorContent = {
      ...content,
      blocks: content.blocks.map((b: EditorBlock) => {
        if (b.type !== "image") return b;
        const file = b.data?.file;
        return {
          ...b,
          data: {
            ...b.data,
            file: {
              id: file?.id,
              url: file?.id ? `/api/files/images/${file.id}` : "",
            },
          },
        };
      }),
    };

    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: {
          ...(prev.translations[activeLang] ?? {}),
          text: isEmpty ? null : JSON.stringify(cleaned),
        },
      },
    }));

    setEditorModal(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setPickingImage(false);

    try {
      const preview = URL.createObjectURL(file);
      setData((prev) => ({
        ...prev,
        mainImage: file,
        imagePreview: preview,
        existingImageId: undefined,
      }));
    } finally {
      setUploading(false);
    }

    return false;
  };

  const submitNews = async (values: NewsFormValues, formReset: () => void) => {
    const formData = new FormData();
    formData.append("visible", String(values.visible));
    formData.append("translations", JSON.stringify(data.translations));

    if (data.mainImage) {
      formData.append("image", data.mainImage);
    } else if (data.existingImageId) {
      formData.append("existingImageId", String(data.existingImageId));
    }
    console.log("TRANSLATIONS RAW:", data.translations);

    for (const [key, value] of formData.entries()) {
      console.log("FORM DATA:", key, value);
    }
    try {
      if (editId) {
        await putAdminNews(editId, formData);
        message.success("Aktualita upravena");
      } else {
        await postNews(formData);
        message.success("Aktualita vytvořena");
      }
      formReset();
      setData({
        translations: defaultTranslations,
      });

      await editorRef.current?.clear();
      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Chyba při ukládání aktuality");
    }
  };

  return {
    data,
    setData,
    editorRef,
    activeLang,
    titleModal,
    altModal,
    editorModal,
    titleInput,
    altInput,
    uploading,
    pickingImage,
    setEditorReady,
    setTitleInput,
    setAltInput,
    openModal,
    saveTitle,
    saveAltText,
    saveEditorText,
    handleImageUpload,
    handleImageClick: () => setPickingImage(true),
    handleImageCancel: () => setPickingImage(false),
    submitNews,
    closeTitleModal: () => setTitleModal(false),
    closeAltModal: () => setAltModal(false),
    closeEditorModal: () => setEditorModal(false),
  };
};
