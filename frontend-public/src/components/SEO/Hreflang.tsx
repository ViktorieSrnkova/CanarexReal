import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export function Hreflang() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/(cs|en|sk)/, "");
  const FRONTEND_URL = import.meta.env.FRONTEND_URL;

  return (
    <Helmet>
      <link rel="alternate" hrefLang="cs" href={`${FRONTEND_URL}/cs${path}`} />
      <link rel="alternate" hrefLang="en" href={`${FRONTEND_URL}/en${path}`} />
      <link rel="alternate" hrefLang="sk" href={`${FRONTEND_URL}/sk${path}`} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${FRONTEND_URL}/cs${path}`}
      />
    </Helmet>
  );
}
