import type { Language } from "./general";

export const PROPERTY_TYPE_OPTIONS = [
  { value: "apartman", label: "Apartmán" },
  { value: "vila", label: "Vila" },
  { value: "dum", label: "Dům" },
  { value: "garsonka", label: "Garsonka" },
  { value: "pozemek", label: "Pozemek" },
] as const;
export type PropertyType = (typeof PROPERTY_TYPE_OPTIONS)[number]["value"];
export interface Translation {
  alt?: string;
  title?: string;
  description?: EditorJS.OutputData;
  details?: EditorJS.OutputData;
}
export type Translations = Record<Language, Translation>;

export type AddressOption = {
  label: string;
  value: number;
  lat?: string;
  lon?: string;
};
export type ImageItem = {
  uid: string;
  file: File;
  url: string;
};
export type UIImage =
  | { type: "existing"; id: number; url: string; poradi: number }
  | { type: "new"; file: File; uid: string };
export interface CreateAdFormValues {
  id?: number;
  isOnHomepage: boolean;
  price: number;
  propertyType: PropertyType;
  locationName: string;
  listingIndex: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: AddressOption | null;
  translations: Translations;
  gallery: File[];
  features: Record<string, boolean>;
}
export interface CreateListingPayload extends CreateAdFormValues {
  translations: Translations;
}
export const FEATURES = [
  { label: "Parkování", value: 14 },
  { label: "Terasa", value: 4 },
  { label: "Bazén", value: 5 },
  { label: "Zahrada", value: 6 },
  { label: "Garáž", value: 7 },
  { label: "Balkón", value: 8 },
  { label: "Vybavení", value: 9 },
  { label: "Výhled na oceán", value: 10 },
  { label: "Výhled na hory", value: 11 },
  { label: "Komunitní bazén", value: 15 },
  { label: "Komunitní zahrada", value: 16 },
  { label: "Blízko pláže", value: 13 },
] as const;

export type FeatureKey = (typeof FEATURES)[number];

export type CreateAdPayload = {
  index: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: string;
  propertyType: string;
  showOnHomepage: boolean;

  attributes: Record<string, boolean>;

  translations: Partial<
    Record<
      "cs" | "en" | "sk",
      {
        alt?: string;
        title?: string;
        description?: EditorJS.OutputData;
        details?: EditorJS.OutputData;
      }
    >
  >;

  images: {
    order: number;
  }[];

  address: {
    value: number;
    label: string;
    lat?: string;
    lon?: string;
  } | null;
};
export const PROPERTY_TYPE_MAP: Record<number, PropertyType> = {
  1: "apartman",
  2: "vila",
  3: "dum",
  4: "garsonka",
  5: "pozemek",
};
export type FeatureId = (typeof FEATURES)[number]["value"];
export const FEATURES_SET = new Set<FeatureId>(FEATURES.map((f) => f.value));
