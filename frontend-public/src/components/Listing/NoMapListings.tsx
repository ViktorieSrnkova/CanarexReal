import { useT } from "../../i18n";
import "../../styles/listing/noFilters.css";

function NoResults() {
  const t = useT();
  return (
    <div className="none-filter">
      <strong>{t("listings.noActiveMapListings")}</strong>
    </div>
  );
}

export default NoResults;
