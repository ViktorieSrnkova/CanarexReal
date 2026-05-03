import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function FAQ() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.FAQ_title")}
        description={t("SEO.FAQ_description")}
        noindex
      />
      <h1>{t("news.workInProgress")}</h1>
      FAQ
    </div>
  );
}

export default FAQ;
