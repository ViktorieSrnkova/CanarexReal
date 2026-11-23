import { NavLink } from "react-router-dom";
import { useT } from "../../i18n";
import Button from "../General/Button";
import "../../styles/components/hero.css";
import { useLang } from "../../hooks/i18n/useLang";

const Hero = () => {
  const t = useT();
  const actions = t<
    {
      btn: string;
      href: string;
    }[]
  >("homepage.hero.actions");
  const { lang } = useLang();
  return (
    <section className="hp-hero" aria-labelledby="uvod">
      <picture className="hero-img pc" typeof="image/webp">
        <img
          src="/pages/hero4.webp"
          width="1672"
          height="941"
          alt={t("homepage.hero.alt")}
          fetchPriority="high"
        />
      </picture>

      <div className="wrap">
        <div className="copy">
          <p className="eyebrow">{t("homepage.hero.eyebrow")}</p>
          <h1 id="uvod">{t("homepage.hero.title")}</h1>
          <p className="lead pc">{t("homepage.hero.lead")}</p>
          <div className="actions">
            <NavLink className="btn" to={`/${lang}/${actions[0].href}`}>
              <Button>{actions[0].btn}</Button>
            </NavLink>
            <NavLink className="btn" to={`/${lang}/${actions[2].href}`}>
              <Button variant="secondary">{actions[2].btn}</Button>
            </NavLink>
          </div>
          <picture className="hero-img mobile" typeof="image/webp">
            <img
              src="/pages/hero4.webp"
              width="1672"
              height="941"
              alt={t("homepage.hero.alt")}
              fetchPriority="high"
            />
          </picture>
          <p className="lead mobile">{t("homepage.hero.lead")}</p>
          <p className="care">{t("homepage.hero.care")}</p>

          <i className="signature">{t("homepage.hero.signature")}</i>
        </div>
      </div>
    </section>
  );
};

export default Hero;
