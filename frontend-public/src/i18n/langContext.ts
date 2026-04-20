import { createContext } from "react";

export type Lang = "cs" | "en" | "sk";

export type LangContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const LangContext = createContext<LangContextType | null>(null);
