import { NavLink } from "react-router-dom";
import { useT } from "../../i18n";
import "../../styles/components/servicesOverlay.css";
import { useLang } from "../../hooks/i18n/useLang";

const ServicesOverview = () => {
  const t = useT();
  const sections = t<
    {
      eyebrow: string;
      title: string;
      p: string;
      link: string;
      textlink: string;
    }[]
  >("homepage.servicesOverview.sections");
  const { lang } = useLang();
  return (
    <section className="servicesOverview" id="sluzby">
      <div className="wrap">
        <div className="section-head">
          <div className="head-wrapper">
            <p className="eyebrow">{t("homepage.servicesOverview.eyebrow")}</p>
            <h2>{t("homepage.servicesOverview.h2")}</h2>
            <p>{t("homepage.servicesOverview.p1")}</p>
          </div>
          <NavLink
            className="textlink"
            to={`/${lang}${t("homepage.servicesOverview.link")}`}
          >
            {t("homepage.servicesOverview.textlink")}
          </NavLink>
        </div>
        <div className="hp-cards">
          {sections.map((section, index) => (
            <article className="hp-card" key={index}>
              <span className="num">{section.eyebrow}</span>
              <h3>{section.title}</h3>
              <p>{section.p}</p>

              {section.link.startsWith("mailto:") ? (
                <a className="textlink" href={section.link}>
                  {section.textlink}
                </a>
              ) : (
                <NavLink className="textlink" to={`/${lang}${section.link}`}>
                  {section.textlink}
                </NavLink>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
