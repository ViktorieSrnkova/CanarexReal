import type { JSONContent } from "@tiptap/react";
import type { Language } from "./general";

type Translation = {
  title: string;
  alt: string;
};

export type NewsFormValues = {
  visible: boolean;
  translations: Record<Language, Translation>;
};

export type NewsFormState = {
  mainImageId?: number;
  existingImageId?: number;
  existingImageUrl?: string;
  imagePreview?: string;
  uploading?: boolean;
  pickingImage?: boolean;
};

export type NewsEditorContent = Record<Language, JSONContent | undefined>;

type NewsAdminTranslation = {
  jazyky_id: number;
  titulek: string | null;
  text: object | undefined;
};

type NewsAdminImageTranslation = {
  jazyky_id: number;
  alt_text: string | null;
};

type NewsAdminImage = {
  id: number;
  poradi: number | null;
  url: string;
  obrazky_preklady: NewsAdminImageTranslation[] | null;
};

export type NewsAdminItem = {
  id: number;
  datum_vytvoreni: string;
  viditelnost: boolean;
  aktuality_preklady: NewsAdminTranslation[];
  obrazky: NewsAdminImage[];
};

export const emptyNewsFormValues: NewsFormValues = {
  visible: true,
  translations: {
    cs: {
      title: "",
      alt: "",
    },
    en: {
      title: "",
      alt: "",
    },
    sk: {
      title: "",
      alt: "",
    },
  },
};

export const emptyEditorContent: NewsEditorContent = {
  cs: { type: "doc", content: [] },
  en: { type: "doc", content: [] },
  sk: { type: "doc", content: [] },
};
