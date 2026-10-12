import { createContext } from "react";
import type { Language } from "../types/general";

export type LangContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

export const LangContext = createContext<LangContextType | null>(null);
