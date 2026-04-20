import { useLang } from "../hooks/i18n/useLang";
import { cs } from "./cs";
import { en } from "./en";
import { sk } from "./sk";

export const translations = {
  cs,
  en,
  sk,
} as const;

export type Lang = keyof typeof translations;

export type TranslationSchema = typeof cs;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | Join<K, Paths<T[K]>>
          : K
        : never;
    }[keyof T]
  : never;

export function useT() {
  const { lang } = useLang();

  return (path: Paths<TranslationSchema>): string => {
    const keys = path.split(".");
    let value: unknown = translations[lang];

    for (const key of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path;
      }
    }

    return typeof value === "string" ? value : path;
  };
}
