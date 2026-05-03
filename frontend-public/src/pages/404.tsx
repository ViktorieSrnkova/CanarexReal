import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function Page404() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.err404_title")}
        description={t("SEO.err404_description")}
        noindex
      />

      <h1>404 Stránka nenalezena</h1>
    </div>
  );
}

export default Page404;
