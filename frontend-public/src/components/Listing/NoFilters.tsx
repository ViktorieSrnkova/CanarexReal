import { useT } from "../../i18n";
import "../../styles/listing/noFilters.css";
function NoFilters() {
  const t = useT();
  return (
    <div className="none-filter">
      <strong>{t("listings.none")}</strong>
    </div>
  );
}

export default NoFilters;
