import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function GDPR() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.GDPR_title")}
        description={t("SEO.GDPR_description")}
      />
      <h1>{t("news.workInProgress")}</h1>
      GDPR
    </div>
  );
}

export default GDPR;
