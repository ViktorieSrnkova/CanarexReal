import { useLocation, Link } from "react-router-dom";
import { useLang } from "../../hooks/i18n/useLang";
import { useT } from "../../i18n";

type Props = {
  hasAppliedFilters: boolean;
  isIndexSearchActive: boolean;
};
const ToggleFilters = ({ hasAppliedFilters, isIndexSearchActive }: Props) => {
  const t = useT();
  const { lang } = useLang();
  const location = useLocation();
  const isMapPage = location.pathname.endsWith("/map");
  const backLink = isMapPage ? `/${lang}/listings` : `/${lang}/map`;
  const backLabel = isMapPage
    ? !hasAppliedFilters && !isIndexSearchActive
      ? t("listings.moveToList")
      : t("listings.filterList")
    : !hasAppliedFilters && !isIndexSearchActive
      ? t("listings.moveToMap")
      : t("listings.filterMap");
  return (
    <div className="navigation-btn mobile">
      <Link
        to={{
          pathname: backLink,
          search: location.search,
        }}
        className="back-to"
      >
        {backLabel} →
      </Link>
    </div>
  );
};

export default ToggleFilters;
