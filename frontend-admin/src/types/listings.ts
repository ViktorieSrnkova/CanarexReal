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
  };
  status: ListingStatus;
  type: ListingType;
  pictograms: ListingPictogram[];
  image: ListingImage | null;
  languages: ListingLanguageMap;
};
export const statusOptions = [
  { value: 1, label: "NA PRODEJ" },
  { value: 2, label: "PRODÁNO" },
  { value: 3, label: "REZERVOVÁNO" },
] as const;
export type StatusOption = (typeof statusOptions)[number];
