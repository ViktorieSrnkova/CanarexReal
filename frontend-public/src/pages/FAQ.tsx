import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/faq.css";

function FAQ() {
  const t = useT();
  return (
    <div>
      <SEO
        title={t("SEO.FAQ_title")}
        description={t("SEO.FAQ_description")}
        noindex
      />
      <div className="description-wrapper faq">
        <h1>{t("FAQ.title")}</h1>
        <h2>{t("FAQ.subtitle1")}</h2>
        <p>{t("FAQ.p1")}</p>
        <h2>{t("FAQ.subtitle2")}</h2>
        <p>{t("FAQ.p2")}</p>
        <h2>{t("FAQ.subtitle3")}</h2>
        <p>{t("FAQ.p3")}</p>
        <ul>
          <li>{t("FAQ.li_1it_1")}</li>
          <li>{t("FAQ.li_1it_2")}</li>
          <li>{t("FAQ.li_1it_3")}</li>
          <li>{t("FAQ.li_1it_4")}</li>
        </ul>
        <p>{t("FAQ.p4")}</p>
        <h2>{t("FAQ.subtitle4")}</h2>
        <p>{t("FAQ.p5")}</p>
        <h2>{t("FAQ.subtitle5")}</h2>
        <p>{t("FAQ.p6")}</p>
        <ul>
          <li>{t("FAQ.li_2it_1")}</li>
          <li>{t("FAQ.li_2it_2")}</li>
          <li>{t("FAQ.li_2it_3")}</li>
        </ul>
        <h2>{t("FAQ.subtitle6")}</h2>
        <p>{t("FAQ.p7")}</p>
        <h2>{t("FAQ.subtitle7")}</h2>
        <p>{t("FAQ.p8")}</p>
        <ol>
          <li>{t("FAQ.li_3it_1")}</li>
          <li>{t("FAQ.li_3it_2")}</li>
          <li>{t("FAQ.li_3it_3")}</li>
        </ol>
        <p>{t("FAQ.p9")}</p>
        <h2>{t("FAQ.subtitle8")}</h2>
        <p>{t("FAQ.p10")}</p>
        <h2>{t("FAQ.subtitle9")}</h2>
        <p>{t("FAQ.p11")}</p>
        <ul>
          <li>{t("FAQ.li_4it_1")}</li>
          <li>{t("FAQ.li_4it_2")}</li>
          <li>{t("FAQ.li_4it_3")}</li>
          <li>{t("FAQ.li_4it_4")}</li>
          <li>{t("FAQ.li_4it_5")}</li>
        </ul>
        <p>{t("FAQ.p12")}</p>
        <h2>{t("FAQ.subtitle10")}</h2>
        <p>{t("FAQ.p13")}</p>
        <h2>{t("FAQ.subtitle11")}</h2>
        <p>{t("FAQ.p14")}</p>
        <h2>{t("FAQ.subtitle12")}</h2>
        <p>{t("FAQ.p15")}</p>
        <h2>{t("FAQ.subtitle13")}</h2>
        <span>
          {t("FAQ.p16")} <strong className="bold">{t("FAQ.bold1")}</strong>
        </span>
      </div>
    </div>
  );
}

export default FAQ;
