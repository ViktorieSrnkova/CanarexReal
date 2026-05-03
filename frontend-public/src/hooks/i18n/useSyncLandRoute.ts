import { useParams } from "react-router-dom";
import { useEffect } from "react";
import type { Lang } from "../../i18n";
import { useLang } from "./useLang";

export function useSyncLangRoute() {
  const { lang } = useParams<{ lang: Lang }>();
  const { setLang } = useLang();

  useEffect(() => {
    if (lang) setLang(lang);
  }, [lang]);
}
