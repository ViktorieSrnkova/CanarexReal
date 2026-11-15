import { Link } from "react-router-dom";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/not-found.css";
import Button from "../components/General/Button";
import { useLang } from "../hooks/i18n/useLang";

function Page404() {
  const t = useT();
  const { lang } = useLang();
  return (
    <section>
      <div className="wrap">
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
            <Link className="no-underline" to={`/${lang}`}>
              {t("err404.button")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Page404;
