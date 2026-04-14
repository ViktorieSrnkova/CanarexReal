import type { Lang, NewsAdminItem, Translation } from "../types/news";
const langMap: Record<number, Lang> = {
  1: "en",
  2: "cs",
  3: "sk",
};
export function mapNewsToTranslations(
  news: NewsAdminItem,
): Record<Lang, Translation> {
  const result: Record<Lang, Translation> = {
    cs: { title: "", text: "", alt: "" },
    en: { title: "", text: "", alt: "" },
    sk: { title: "", text: "", alt: "" },
  };

  const mainImage = news.obrazky.find((img) => img.poradi === 0);

  // 👇 TADY je ten fix
  const imageTranslations = mainImage?.obrazky_preklady ?? [];

  imageTranslations.forEach((p) => {
    const lang = langMap[p.jazyky_id];
    if (!lang) return;

    result[lang].alt = p.alt_text ?? "";
  });

  news.aktuality_preklady.forEach((t) => {
    const lang = langMap[t.jazyky_id];
    if (!lang) return;

    result[lang].title = t.titulek ?? "";
    result[lang].text = t.text ?? "";
  });

  return result;
}
