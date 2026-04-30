import { useT } from "../i18n";

function News() {
  const t = useT();
  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h2>{t("news.workInProgress")}</h2>
    </div>
  );
}

export default News;
