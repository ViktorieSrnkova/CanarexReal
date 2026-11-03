export const LISTING_FILTER_KEYS = [
  "type",
  "priceFrom",
  "priceTo",
  "sizeFrom",
  "sizeTo",
  "bedrooms",
  "bathrooms",
] as const;

export function getListingFilterSearch(search: string): string {
  const current = new URLSearchParams(search);
  const filters = new URLSearchParams();

  LISTING_FILTER_KEYS.forEach((key) => {
    const value = current.get(key);
    if (value !== null) filters.set(key, value);
  });

  return filters.toString();
}
