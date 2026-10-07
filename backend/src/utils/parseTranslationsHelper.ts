export type NewsTranslationInput = {
  title?: string;
  text?: object | null;
  alt?: string;
};

export function parseTranslations(
  translations: unknown,
): Record<string, NewsTranslationInput> {
  if (
    typeof translations !== "object" ||
    translations === null ||
    Array.isArray(translations)
  ) {
    throw new Error("Invalid translations");
  }

  return translations as Record<string, NewsTranslationInput>;
}
