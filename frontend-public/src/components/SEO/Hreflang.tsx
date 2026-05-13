import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
export function Hreflang() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/(cs|en|sk)/, "") || "/";
  return (
    <Helmet>
      <link
        rel="alternate"
        hrefLang="cs"
        href={`${VITE_FRONTEND_URL}/cs${path}`}
      />
      <link
        rel="alternate"
        hrefLang="en"
        href={`${VITE_FRONTEND_URL}/en${path}`}
      />
      <link
        rel="alternate"
        hrefLang="sk"
        href={`${VITE_FRONTEND_URL}/sk${path}`}
      />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${VITE_FRONTEND_URL}/cs${path}`}
      />
    </Helmet>
  );
}
