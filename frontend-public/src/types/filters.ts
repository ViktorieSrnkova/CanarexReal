export type ListingFilters = {
  type?: number[];
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
