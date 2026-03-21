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
  altTexts: AltTexts;
  translations: Record<Lang, Translation>;
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
