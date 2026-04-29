import { useT } from "../../i18n";
import "../../styles/listing/noFilters.css";
function NoFilters() {
  const t = useT();
  return (
    <div className="none-filter">
      <h2>{t("listings.none")}</h2>
    </div>
  );
}

export default NoFilters;
