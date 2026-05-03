import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function News() {
  const t = useT();
  return (
    <>
      <SEO
        title={t("SEO.News_title")}
        description={t("SEO.News_description")}
        noindex
      />
      <div style={{ margin: "auto", textAlign: "center" }}>
        <h1>{t("news.workInProgress")}</h1>
      </div>
    </>
  );
}

export default News;
