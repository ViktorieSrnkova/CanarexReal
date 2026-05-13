import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";

const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
export function Canonical() {
  const { lang } = useParams();
  const location = useLocation();

  const path = location.pathname.replace(/^\/(cs|en|sk)/, "") || "/";
  return (
    <Helmet>
      <link rel="canonical" href={`${VITE_FRONTEND_URL}/${lang}${path}`} />
    </Helmet>
  );
}
