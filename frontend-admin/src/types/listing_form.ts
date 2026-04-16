import type { Language } from "./general";

export type PropertyType = "apartman" | "vila" | "dum" | "garsonka" | "pozemek";

export interface Translation {
  alt?: string;
  title?: string;
  description?: EditorJS.OutputData;
  details?: EditorJS.OutputData;
}
export type Translations = Record<Language, Translation>;

export type AddressOption = {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
};

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
    value: number;
    label: string;
  } | null;
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
