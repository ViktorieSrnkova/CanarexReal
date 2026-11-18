import { createElement, Fragment } from "react";
import { useLang } from "../hooks/i18n/useLang";
import { cs } from "./cs";
import { en } from "./en";
import { sk } from "./sk";

const translations = {
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

function formatTranslation(value: unknown): unknown {
  if (typeof value === "string") {
    if (!value.includes("**")) return value;

    const parts = value.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return createElement("strong", { key: index }, part.slice(2, -2));
      }

      return createElement(Fragment, { key: index }, part);
    });
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatTranslation(item));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        formatTranslation(item),
      ]),
    );
  }

  return value;
}

export function useT() {
  const { lang } = useLang();

  return <T = string>(path: Paths<TranslationSchema>): T => {
    const keys = path.split(".");
    let value: unknown = translations[lang];

    for (const key of keys) {
      if (typeof value === "object" && value !== null) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return path as T;
      }
    }

    return formatTranslation(value) as T;
  };
}
