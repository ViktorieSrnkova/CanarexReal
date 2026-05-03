import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";

export function Canonical() {
  const { lang } = useParams();
  const location = useLocation();

  const path = location.pathname.replace(/^\/(cs|en|sk)/, "");
  const FRONTEND_URL = import.meta.env.FRONTEND_URL;
  return (
    <Helmet>
      <link rel="canonical" href={`${FRONTEND_URL}/${lang}${path}`} />
    </Helmet>
  );
}
