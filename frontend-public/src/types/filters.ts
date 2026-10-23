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
export type ListingSort = "date" | "price_asc" | "price_desc";
