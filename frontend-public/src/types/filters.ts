export const PROPERTY_TYPE_OPTIONS = [
  { value: 1, label: "Apartmán" },
  { value: 3, label: "Vila" },
  { value: 2, label: "Dům" },
  { value: 4, label: "Garsonka" },
  { value: 5, label: "Pozemek" },
] as const;
export type PropertyType = (typeof PROPERTY_TYPE_OPTIONS)[number]["value"];
export type ListingFilters = {
  query?: string;
  typeCodes?: PropertyType[];
  priceFrom?: number;
  priceTo?: number;
  sizeFrom?: number;
  sizeTo?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  sort?: ListingSort;
};
export const SORT_OPTIONS = [
  { label: "Nejnovější", value: "date" },
  { label: "Cena od nejnižší", value: "price_asc" },
  { label: "Cena od nejvyšší", value: "price_desc" },
] as const;

export type ListingSort = (typeof SORT_OPTIONS)[number]["value"];
