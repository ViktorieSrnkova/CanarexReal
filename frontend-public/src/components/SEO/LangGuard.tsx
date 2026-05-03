import { useParams, Navigate, useLocation } from "react-router-dom";

const validLangs = ["cs", "en", "sk"];

export function LangGuard({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const location = useLocation();

  if (!lang || !validLangs.includes(lang)) {
    return <Navigate to={`/cs${location.pathname}`} replace />;
  }

  return <>{children}</>;
}
