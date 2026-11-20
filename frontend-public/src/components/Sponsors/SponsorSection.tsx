import { useT } from "../../i18n";
import "../../styles/components/sponsors.css";

const SponsorsSection = () => {
  const t = useT();
  const cards = t<
    {
      eyebrow: string;
      title: string;
      subtext: string;
      linkText: string;
      href: string;
      image: string;
      alt: string;
    }[]
  >("sponsors.cards");

  return (
    <section className="sponsors" id="sluzby">
      <div className="wrap">
        <div className="section-head">
          <div className="head-wrapper">
            <p className="eyebrow">{t("sponsors.eyebrow")}</p>
            <h2>{t("sponsors.title")}</h2>
            <p>{t("sponsors.p")}</p>
          </div>
        </div>
        <div className="hp-cards">
          {cards.map((card, index) => (
            <article className="hp-card" key={index}>
              <div className="top">
                <div className="top-left">
                  <span className="num">{card.eyebrow}</span>
                  <h3>{card.title}</h3>
                </div>
                <img src={card.image} alt={card.alt} />
              </div>
              <p>{card.subtext}</p>

              <a className="textlink" href={card.href}>
                {card.linkText}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
