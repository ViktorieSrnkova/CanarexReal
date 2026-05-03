import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function SingleNews() {
  const t = useT();
  return (
    <div>
      <SEO
        title="Stránka nenalezena | CanarexReal"
        description="Tato stránka neexistuje nebo byla odstraněna."
        noindex
      />
      <h1>{t("news.workInProgress")}</h1>
      SingleNews
    </div>
  );
}

export default SingleNews;
