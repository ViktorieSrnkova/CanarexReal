export type Lang = "cs" | "en" | "sk";

export type Translation = {
  title?: string;
  text?: string;
};

export type AltTexts = {
  cs?: string;
  en?: string;
  sk?: string;
};

export type NewsFormState = {
  visible?: boolean;
  mainImage?: File;
  existingImageId?: number;
  existingImageUrl?: string;
  altTexts: AltTexts;
  translations: Record<Lang, Translation>;
  imagePreview?: string;
};
export type NewsFormValues = {
  visible: boolean;
};

export type UploadedImage = {
  success: number;
  file: {
    url: string;
    alt?: string;
  };
};

export type NewsAdminTranslation = {
  jazyky_id: number;
  titulek: string | null;
  text?: string | null;
};

export type NewsAdminImage = {
  id: number;
  url: string;
  alt?: string | null;
  poradi?: number;
};

export type NewsAdminItem = {
  id: number;
  datum_vytvoreni: string;
  viditelnost: boolean;
  aktuality_preklady: NewsAdminTranslation[];
  obrazky: NewsAdminImage[];
};
export type Translations = {
  cs: { text: string; title: string };
  en: { text: string; title: string };
  sk: { text: string; title: string };
};
