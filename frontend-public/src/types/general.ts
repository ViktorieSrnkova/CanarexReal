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
