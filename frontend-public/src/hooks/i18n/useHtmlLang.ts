import { useEffect } from "react";
import { useLang } from "./useLang";

export function useHtmlLang() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
}
