import { useState, useRef, useEffect } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { NewsFormValues, Translation, Lang } from "../types/news";
import { postNews } from "../api/news";
import { message } from "antd";

type FormDataState = {
  translations: Record<string, Translation>;
  altTexts: Record<string, string>;
  image?: File;
  imagePreview?: string;
};

export const useNewsForm = () => {
  const [data, setData] = useState<FormDataState>({
    translations: { cs: {}, en: {}, sk: {} },
    altTexts: { cs: "", en: "", sk: "" },
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
      setTitleInput(data.translations[lang]?.title || "");
      setTitleModal(true);
    } else if (type === "alt") {
      setAltInput(data.altTexts[lang] || "");
      setAltModal(true);
    } else if (type === "editor") {
      setActiveLang(lang);
      setEditorModal(true);
    }
  };
  useEffect(() => {
    if (!editorModal || !activeLang) return;
    if (!editorRef.current || !editorReady) return;

    const saved = data.translations[activeLang]?.text;
    const parsed = saved ? JSON.parse(saved) : { blocks: [] };

    editorRef.current.render(parsed);
  }, [editorModal, activeLang, editorReady]);

  const saveTitle = () => {
    if (!activeLang) return;
    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: { ...prev.translations[activeLang], title: titleInput },
      },
    }));
    setTitleModal(false);
  };
  const saveAltText = () => {
    if (!activeLang) return;
    setData((prev) => ({
      ...prev,
      altTexts: { ...prev.altTexts, [activeLang]: altInput },
    }));
    setAltModal(false);
  };

  const saveEditorText = async () => {
    if (!editorRef.current || !activeLang) return;
    const content = await editorRef.current.save();
    setData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: {
          ...prev.translations[activeLang],
          text: JSON.stringify(content),
        },
      },
    }));
    setEditorModal(false);
    console.log("Saved content:", content);
  };
  const closeTitleModal = () => setTitleModal(false);
  const closeAltModal = () => setAltModal(false);
  const closeEditorModal = () => setEditorModal(false);

  const handleImageClick = () => setPickingImage(true);
  const handleImageCancel = () => setPickingImage(false);
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setPickingImage(false);
    try {
      const preview = URL.createObjectURL(file);
      setData((prev) => ({ ...prev, image: file, imagePreview: preview }));
    } finally {
      setUploading(false);
    }
    return false;
  };

  const submitNews = async (values: NewsFormValues, formReset: () => void) => {
    const formData = new FormData();
    formData.append("visible", String(values.visible));
    formData.append("translations", JSON.stringify(data.translations));
    formData.append("altTexts", JSON.stringify(data.altTexts));
    if (data.image) formData.append("image", data.image);

    try {
      await postNews(formData);
      message.success("Aktualita úspěšně vytvořena");
      formReset();
      setData({ translations: {}, altTexts: {} });
      if (editorRef.current) {
        await editorRef.current.clear();
      }
    } catch (error: unknown) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Chyba při vytváření aktuality");
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
    handleImageClick,
    submitNews,
    closeTitleModal,
    closeAltModal,
    closeEditorModal,
    handleImageCancel,
  };
};
