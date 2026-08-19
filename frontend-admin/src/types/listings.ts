import type { PropertyType } from "./listing_form";

export type ListingLanguageMap = {
  en: boolean;
  cs: boolean;
  sk: boolean;
};

export type ImageLanguageMap = ListingLanguageMap;

export type ListingStatus = {
  id: number;
  label: string | null;
};

export type ListingType = {
  id: number;
  kod: string;
  label: string | null;
};

export type ListingPictogram = {
  id: number;
  code: string;
  label: string | null;
};

export type ListingImage = {
  id: number;
  url: string;
  order: number;
  hasAlt: ListingLanguageMap;
};

export type ListingRow = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  reprezentativni: boolean;

  adresy: {
    lokace: string | null;
    komplex: string | null;
    oblast_prodeje: string | null;
  };
  status: ListingStatus;
  type: ListingType;
  pictograms: ListingPictogram[];
  image: ListingImage | null;
  languages: ListingLanguageMap;
};

export type ListingFilters = {
  query?: string;
  index?: string;
  statusIds?: number[];
  typeCodes?: PropertyType[];
  priceFrom?: string;
  priceTo?: string;
  sizeFrom?: string;
  sizeTo?: string;
  location?: string;
  bedroomsFrom?: string;
  bedroomsTo?: string;
  bathroomsFrom?: string;
  bathroomsTo?: string;
  pictogramIds?: number[];
  komplex?: string;
};

export type ListingFilterOption = {
  value: number;
  label: string;
};

export const statusOptions = [
  { value: 1, label: "NA PRODEJ" },
  { value: 2, label: "PRODÁNO" },
  { value: 3, label: "REZERVOVÁNO" },
] as const;
export type StatusOption = (typeof statusOptions)[number];

export type ListingSearchResult = {
  id: number;
  index: number;
  cena_v_eur: number | null;
  lokace: string | null;
};

export type ListingSearchResponse = {
  listings: ListingSearchResult[];
};

export type ListingDetailResponse = {
  listing: ListingDetail;
};

export type ListingDetail = {
  id: number;
  index: number;
  cena_v_eur: number | null;
  loznice: number | null;
  koupelny: number | null;
  velikost: number | null;

  inzeraty_preklady: {
    titulek: string | null;
    popis: string | null;
    detaily: string | null;
    jazyky_id: number;
  }[];
  adresy: {
    lat: number;
    lng: number;
    cela_adresa: string;
    komplex?: string;
    oblast_prodeje: string;
  };

  obrazky: {
    id: number;
    poradi: number;
  }[];

  inzeraty_piktogramy: {
    id: number;
    iconSvg: string | null;
    translations: {
      jazyky_id: number;
      name: string | null;
    }[];
  }[];
};
