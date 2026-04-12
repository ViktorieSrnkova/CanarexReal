import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

export type EditorTools = Record<string, ToolConstructable | ToolSettings>;

export type PropertyType = "apartman" | "vila" | "dum" | "garsonka" | "pozemek";

export interface CreateAdFormValues {
  isOnHomepage: boolean;
  price: number;
  propertyType: PropertyType;
  locationName: string;
  listingIndex: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: {
    value: string;
    label: string;
  } | null;
  translations: Translations;
  gallery: File[];
  mainImageAlt: string;
  features: Record<string, boolean>;
}
export interface Translation {
  title: string;
  description: string;
  details: string;
}

export type Language = "cs" | "en" | "sk";

export type Translations = Record<Language, Translation>;

export interface CreateListingPayload extends CreateAdFormValues {
  translations: Translations;
}
export const FEATURES = [
  "Parkování",
  "Terasa",
  "Bazén",
  "Zahrada",
  "Garáž",
  "Balkón",
  "Vybabení",
  "Výhled na oceán",
  "Výhled na hory",
  "VV",
  "Komunitní bazén",
  "Komunitní zahrada",
  "Blízko pláže",
] as const;

export type FeatureKey = (typeof FEATURES)[number];
