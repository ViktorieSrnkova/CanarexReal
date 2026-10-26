import { Link } from "react-router-dom";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/not-found.css";
import Button from "../components/General/Button";

function Page404() {
  const t = useT();
  return (
    <div className="not-found">
      <SEO
        title={t("SEO.err404_title")}
        description={t("SEO.err404_description")}
        noindex
      />

      <h1>{t("err404.title")}</h1>
      <h2>{t("err404.subtext")}</h2>
      <p>{t("err404.description")}</p>
      <Button>
        <Link className="no-underline" to={"/"}>
          {t("err404.button")}
        </Link>
      </Button>
    </div>
  );
}

export default Page404;
