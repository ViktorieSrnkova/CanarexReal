import { useT } from "../../i18n";
import stan from "../../assets/stan.avif";
import useImagePreloader from "../../hooks/useImagePreloader";
import beach from "../../assets/beach.avif";
import livingroom from "../../assets/livingroom.avif";
import villa from "../../assets/villa.avif";
import garden from "../../assets/garden.avif";
import "../../styles/components/our-services.css";
import { useLang } from "../../hooks/i18n/useLang";

const preloadSrcList: string[] = [stan];
const OurServices = () => {
  const t = useT();
  useImagePreloader(preloadSrcList);
  const { lang } = useLang();
  const sections = t<
    {
      subtitle: string;
      p1: string;
      listTitle: string;
      list: string[];
      p2: string;
      p3: string;
    }[]
  >("services.sections");
  const sections2 = t<
    {
      subtitle: string;
      p1: string;
      p2?: string;
    }[]
  >("services.sections2");
  return (
    <section className="services-section">
      <div className="wrap">
        <div className="white serv beggining">
          <p className="eyebrow">{t("services.eyebrow")}</p>
          <h1>{t("services.title")}</h1>
          <div className="s-first">
            <img
              className="services-img stan pc"
              src={stan}
              alt="Stan Srnka"
              fetchPriority="high"
            />
            <div className="s-text">
              <div className="services-cards">
                {sections.splice(0, 2).map((section, index) => (
                  <article className="services-card" key={index}>
                    <h3>{section.subtitle}</h3>
                    {section.p1 !== "" && <p>{section.p1}</p>}
                    {section.listTitle !== "" && <p>{section.listTitle}</p>}
                    <ul>
                      {section.list.length !== 0 &&
                        section.list.map((li, index) => (
                          <li key={index}>{li}</li>
                        ))}
                    </ul>
                    {section.p2 !== "" && <p>{section.p2}</p>}
                    {section.p3 !== "" && <p>{section.p3}</p>}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gray">
        <div className="wrap">
          <div className="serv middle">
            <div className="s-first">
              <div className="s-text">
                <div className="services-cards">
                  {sections.splice(0, 3).map((section, index) => (
                    <article className="services-card" key={index}>
                      <h3>{section.subtitle}</h3>
                      {section.p1 !== "" && <p>{section.p1}</p>}
                      {section.listTitle !== "" && <p>{section.listTitle}</p>}
                      <ul>
                        {section.list.length !== 0 &&
                          section.list.map((li, index) => (
                            <li key={index}>{li}</li>
                          ))}
                      </ul>
                      {section.p2 !== "" && <p>{section.p2}</p>}
                      {section.p3 !== "" && <p>{section.p3}</p>}
                    </article>
                  ))}
                </div>
              </div>
              <img
                className="services-img pc"
                src={beach}
                alt="Tenerife beach"
              />
            </div>
            <img
              className="services-img mobile"
              src={beach}
              alt="Tenerife beach"
            />
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="white end serv">
          <div className="s-first">
            <div className="s-text">
              <div className="services-cards">
                {sections.splice(0, 1).map((section, index) => (
                  <article className="services-card" key={index}>
                    <h3>{section.subtitle}</h3>
                    {section.p1 !== "" && <p>{section.p1}</p>}
                    {section.listTitle !== "" && <p>{section.listTitle}</p>}
                    <ul>
                      {section.list.length !== 0 &&
                        section.list.map((li, index) => (
                          <li key={index}>{li}</li>
                        ))}
                    </ul>
                    {section.p2 !== "" && <p>{section.p2}</p>}
                    {section.p3 !== "" && <p>{section.p3}</p>}
                  </article>
                ))}
              </div>
            </div>
            <img
              className="services-img livingroom"
              src={livingroom}
              alt="Interior"
            />
          </div>
          <div className="s-first">
            <img
              className="services-img villa"
              src={villa}
              alt="Villa with pool"
            />
            <div className="s-text">
              <div className="services-cards">
                {sections.splice(0, 2).map((section, index) => (
                  <article className="services-card" key={index}>
                    <h3>{section.subtitle}</h3>
                    {section.p1 !== "" && <p>{section.p1}</p>}
                    {section.listTitle !== "" && <p>{section.listTitle}</p>}
                    <ul>
                      {section.list.length !== 0 &&
                        section.list.map((li, index) => (
                          <li key={index}>{li}</li>
                        ))}
                    </ul>
                    {section.p2 !== "" && <p>{section.p2}</p>}
                    {section.p3 !== "" && <p>{section.p3}</p>}
                    {index == 1 && (
                      <>
                        <p>
                          <span>{t("services.czech")}</span>{" "}
                          <a href={`/${lang}/mortgage#calculator`}>
                            {t("services.csobLink")}
                          </a>{" "}
                          <span>{t("services.czechAfter")}</span>
                        </p>
                        <p>{t("services.slovak")}</p>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="s-first">
            <div className="s-text">
              <div className="services-cards">
                {sections2.map((section, index) => (
                  <article className="services-card" key={index}>
                    <h3>{section.subtitle}</h3>
                    <p>{section.p1}</p>
                    {section.p2 && <p>{section.p2}</p>}
                  </article>
                ))}
              </div>
            </div>
            <img className="services-img garden" src={garden} alt="Garden" />
          </div>
          <p className="s-bottom">
            <p>
              <span>{t("services.linkSentence")}</span>{" "}
              <a href={`/${lang}/faq`}>{t("services.link")}</a>
            </p>
            <strong className="bold"> {t("services.strong")}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
