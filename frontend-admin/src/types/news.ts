export type Lang = "cs" | "en" | "sk";

export type Translation = {
  title?: string;
  text?: string;
  alt?: string;
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
  text: string | null;
};

export type NewsAdminImageTranslation = {
  jazyky_id: number;
  alt_text: string | null;
};

export type NewsAdminImage = {
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
export type Translations = Record<Lang, Translation>;
