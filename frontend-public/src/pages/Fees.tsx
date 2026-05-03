import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function Fees() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.Fees_title")}
        description={t("SEO.Fees_description")}
        noindex
      />
      <h1>{t("news.workInProgress")}</h1>
      Fees
    </div>
  );
}

export default Fees;
