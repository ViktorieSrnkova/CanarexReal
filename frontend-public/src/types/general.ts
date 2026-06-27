export type Language = "cs" | "en" | "sk";
export const LANGUAGE_MAP: Record<number, Language> = {
  1: "en",
  2: "cs",
  3: "sk",
};
export const LANGUAGE_TO_ID: Record<Language, number> = {
  en: 1,
  cs: 2,
  sk: 3,
};
export type FxRates = {
  CZK: number;
  GBP: number;
};

export const PROPERTY_TYPE_LABELS: Record<number, Record<number, string>> = {
  1: {
    1: "Apartment",
    2: "Apartmán",
    3: "Apartmán",
  },
  2: {
    1: "Villa",
    2: "Vila",
    3: "Vila",
  },
  3: {
    1: "House",
    2: "Dům",
    3: "Dom",
  },
  4: {
    1: "Studio",
    2: "Garsonka",
    3: "Garsónka",
  },
  5: {
    1: "Land",
    2: "Pozemek",
    3: "Pozemok",
  },
};

export const FORM_TYPE_LABELS: Record<number, Record<number, string>> = {
  1: {
    1: "Contact",
    2: "Kontakt",
    3: "Kontakt",
  },
  2: {
    1: "Listing inquiry",
    2: "Dotaz k inzerátu",
    3: "Otázka k inzerátu",
  },
  3: {
    1: "General inquiry",
    2: "Poptávka",
    3: "Dopyt",
  },
};
