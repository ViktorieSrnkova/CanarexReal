import { useEffect, useState } from "react";
import { type Lang, LangContext } from "./langContext";

const getInitialLang = (): Lang => {
  const path = window.location.pathname;

  if (path.startsWith("/cs")) return "cs";
  if (path.startsWith("/sk")) return "sk";
  if (path.startsWith("/en")) return "en";

  const saved = localStorage.getItem("lang");
  if (saved === "cs" || saved === "en" || saved === "sk") {
    return saved;
  }

  const browserLang = navigator.language;

  if (browserLang.startsWith("cs")) return "cs";
  if (browserLang.startsWith("sk")) return "sk";
  return "en";
};

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}
