export function parseTranslations(translations: string) {
  return JSON.parse(translations) as Record<
    string,
    { title?: string; text?: string; alt?: string }
  >;
}
