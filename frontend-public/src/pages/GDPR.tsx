import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/gdpr.css";

function GDPR() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.GDPR_title")}
        description={t("SEO.GDPR_description")}
      />

      <div className="description-wrapper gdpr">
        <h1>{t("GDPR.title")}</h1>
        <p className="has-margin">{t("GDPR.intro")}</p>
        <h2>{t("GDPR.principles")}</h2>
        <ul>
          <li>{t("GDPR.li_1it_1")}</li>
          <li>{t("GDPR.li_1it_2")}</li>
          <li>{t("GDPR.li_1it_3")}</li>
          <li>{t("GDPR.li_1it_4")}</li>
        </ul>
        <h2>{t("GDPR.what")}</h2>
        <ul>
          <li>{t("GDPR.li_2it_1")}</li>
          <li>{t("GDPR.li_2it_2")}</li>
          <li>{t("GDPR.li_2it_3")}</li>
          <li>{t("GDPR.li_2it_4")}</li>
        </ul>
        <p className="has-margin">{t("GDPR.p2")}</p>
        <p>{t("GDPR.p3")}</p>
        <ul>
          <li>{t("GDPR.li_3it_1")}</li>
          <li>{t("GDPR.li_3it_2")}</li>
          <li>{t("GDPR.li_3it_3")}</li>
          <li>{t("GDPR.li_3it_4")}</li>
        </ul>
        <span className="has-margin gdpr-link">
          {t("GDPR.p4")}{" "}
          <a href="https://www.realspektrum.cz/">{t("GDPR.here")}</a>
        </span>

        <h2>{t("GDPR.from")}</h2>
        <ul>
          <li>{t("GDPR.li_4it_1")}</li>
          <li>{t("GDPR.li_4it_2")}</li>
        </ul>
        <h2>{t("GDPR.for")}</h2>
        <h3>{t("GDPR.u1")}</h3>
        <ul>
          <li>{t("GDPR.li_5it_1")}</li>
          <li>{t("GDPR.li_5it_2")}</li>
          <li>{t("GDPR.li_5it_3")}</li>
        </ul>
        <h3>{t("GDPR.u2")}</h3>
        <ul>
          <li>{t("GDPR.li_6it_1")}</li>
        </ul>
        <p className="has-margin">{t("GDPR.p5")}</p>
        <h2>{t("GDPR.whom")}</h2>
        <ul>
          <li>{t("GDPR.li_7it_1")}</li>
          <li>{t("GDPR.li_7it_2")}</li>
          <li>{t("GDPR.li_7it_3")}</li>
        </ul>
        <h2>{t("GDPR.how")}</h2>
        <ul>
          <li>{t("GDPR.li_8it_1")}</li>
          <li>{t("GDPR.li_8it_2")}</li>
          <li>{t("GDPR.li_8it_3")}</li>
        </ul>
        <h2>{t("GDPR.rights")}</h2>
        <ul>
          <li>{t("GDPR.li_9it_1")}</li>
          <li>{t("GDPR.li_9it_2")}</li>
          <li>{t("GDPR.li_9it_3")}</li>
          <li>{t("GDPR.li_9it_4")}</li>
          <li>{t("GDPR.li_9it_5")}</li>
          <ul>
            <li>{t("GDPR.li_9it_5_sub")}</li>
            <li>{t("GDPR.li_9it_5_sub2")}</li>
            <li>{t("GDPR.li_9it_5_sub3")}</li>
          </ul>
        </ul>

        <p>{t("GDPR.outro")}</p>
      </div>
    </div>
  );
}

export default GDPR;
