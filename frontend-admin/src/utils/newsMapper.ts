import type { JSONContent } from "@tiptap/react";
import {
  type Lang,
  type NewsAdminItem,
  type NewsEditorContent,
  type NewsFormValues,
} from "../types/news";

const langMap: Record<number, Lang> = {
  1: "en",
  2: "cs",
  3: "sk",
};

export const castTiptapContent = (
  value: object | null | undefined,
): JSONContent | undefined => {
  if (!value) return undefined;

  if ("type" in value && typeof value.type === "string") {
    return value as JSONContent;
  }

  return undefined;
};

export function mapNewsToFormValues(
  news: NewsAdminItem,
): Pick<NewsFormValues, "visible" | "translations"> {
  const translations: NewsFormValues["translations"] = {
    cs: { title: "", alt: "" },
    en: { title: "", alt: "" },
    sk: { title: "", alt: "" },
  };
  news.aktuality_preklady.forEach((translation) => {
    const lang = langMap[translation.jazyky_id];
    if (!lang) return;
    translations[lang].title = translation.titulek ?? "";
  });
  const mainImage = news.obrazky.find((img) => img.poradi === 0);

  mainImage?.obrazky_preklady?.forEach((translation) => {
    const lang = langMap[translation.jazyky_id];
    if (!lang) return;
    translations[lang].alt = translation.alt_text ?? "";
  });
  return {
    visible: news.viditelnost,
    translations,
  };
}

export function mapNewsToEditorContent(news: NewsAdminItem): NewsEditorContent {
  const result: NewsEditorContent = {
    cs: undefined,
    en: undefined,
    sk: undefined,
  };
  news.aktuality_preklady.forEach((translation) => {
    const lang = langMap[translation.jazyky_id];
    if (!lang) return;
    result[lang] = castTiptapContent(translation.text);
  });
  return result;
}
