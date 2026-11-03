import { useT } from "../../i18n";
import "../../styles/listing/noFilters.css";

function NoResults() {
  const t = useT();
  return (
    <div className="none-filter">
      <h2>{t("listings.noActiveMapListings")}</h2>
    </div>
  );
}

export default NoResults;
