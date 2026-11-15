import { useT } from "../../i18n";
import stan from "../../assets/stan.avif";
import useImagePreloader from "../../hooks/useImagePreloader";
import beach from "../../assets/beach.avif";
import livingroom from "../../assets/livingroom.avif";
import villa from "../../assets/villa.avif";
import garden from "../../assets/garden.avif";
import { Link } from "react-router-dom";
import "../../styles/components/our-services.css";
import { useLang } from "../../hooks/i18n/useLang";

const preloadSrcList: string[] = [stan];
const OurServices = () => {
  const t = useT();
  useImagePreloader(preloadSrcList);
  const { lang } = useLang();

  const list1 = t<string[]>("services.list1");
  const list2 = t<string[]>("services.list2");
  const list3 = t<string[]>("services.list3");
  const list4 = t<string[]>("services.list4");
  const list5 = t<string[]>("services.list5");
  const list6 = t<string[]>("services.list6");
  const list7 = t<string[]>("services.list7");
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
              <h3>{t("services.subtitle1")}</h3>
              <span>
                {t("services.p1")}{" "}
                <strong className="bold">{t("services.b1")}</strong>{" "}
                {t("services.p2")}{" "}
                <strong className="bold">{t("services.b2")}</strong>{" "}
                {t("services.p3")}
              </span>
              <span>
                <p>
                  {t("services.p4")}{" "}
                  <strong className="bold">{t("services.b4")}</strong>
                </p>
              </span>
              <h3>{t("services.subtitle2")}</h3>
              <span>
                {t("services.p5")}{" "}
                <strong className="bold">{t("services.b5")}</strong>
              </span>
              <ul>
                {list1.map((row, i) => (
                  <li key={i}>{row}</li>
                ))}
              </ul>
              <p>{t("services.p6")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="gray">
        <div className="wrap">
          <div className="serv middle">
            <div className="s-first">
              <div className="s-text">
                <h3>{t("services.subtitle3")}</h3>
                <p>{t("services.p7")}</p>
                <ul>
                  {list2.map((row, i) => (
                    <li key={i}>{row}</li>
                  ))}
                </ul>
                <span>
                  {t("services.p8")}{" "}
                  <strong className="bold">{t("services.b8")}</strong>
                </span>
                <h3>{t("services.subtitle4")}</h3>
                <p>{t("services.p9")}</p>
                <ul>
                  {list3.map((row, i) => (
                    <li key={i}>{row}</li>
                  ))}
                </ul>
                <span>
                  {t("services.p10")}{" "}
                  <strong className="bold">{t("services.b10")}</strong>
                </span>
                <h3>{t("services.subtitle5")}</h3>
                <p>{t("services.p11")}</p>
                <ul>
                  {list4.map((row, i) => (
                    <li key={i}>{row}</li>
                  ))}
                </ul>
              </div>
              <img
                className="services-img pc"
                src={beach}
                alt="Tenerife beach"
              />
            </div>
            <div className="s-bottom">
              <p>{t("services.p12")}</p>{" "}
              <strong className="bold">{t("services.b12")}</strong>
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
              <h3>{t("services.subtitle6")}</h3>
              <p>{t("services.p13")}</p>
              <p>{t("services.p14")}</p>
              <ul>
                <li>
                  {t("services.l5_item1_normal")}{" "}
                  <strong className="bold">
                    {t("services.l5_item1_bold")}
                  </strong>
                </li>
                {list5.map((row, i) => (
                  <li key={i}>{row}</li>
                ))}
              </ul>
              <strong className="bold">{t("services.b14")}</strong>
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
              <h3>{t("services.subtitle7")}</h3>
              <p>{t("services.p15")}</p>
              <ul>
                {list6.map((row, i) => (
                  <li key={i}>{row}</li>
                ))}
              </ul>
              <span>
                {t("services.p16")}{" "}
                <strong className="bold">{t("services.b16")}</strong>{" "}
                {t("services.p17")}
              </span>
              <span>
                {t("services.p18")}{" "}
                <strong className="bold">{t("services.b18")}</strong>
              </span>
              <h3>{t("services.subtitle8")}</h3>
              <span>
                {t("services.p19")}{" "}
                <strong className="bold">{t("services.b19")}</strong>{" "}
                {t("services.p20")}
              </span>
              <ul>
                {list7.map((row, i) => (
                  <li key={i}>{row}</li>
                ))}
              </ul>
              <span>
                <p>
                  {t("services.p21")}{" "}
                  <strong className="bold">{t("services.b21")}</strong>
                </p>
              </span>
              <span>
                <p>
                  {t("services.p22")}{" "}
                  <strong className="bold">{t("services.b22")}</strong>{" "}
                  {t("services.p23")}
                </p>
              </span>
              <span>
                <p>
                  <strong className="bold">{t("services.b23")}</strong>{" "}
                  {t("services.p24")}
                </p>
              </span>
              <span>
                <p>
                  {t("services.p25")}{" "}
                  <strong className="bold">{t("services.b25")}</strong>{" "}
                  {t("services.p26")}
                </p>
              </span>
            </div>
          </div>
          <div className="s-first">
            <div className="s-text">
              <h3>{t("services.subtitle9")}</h3>
              <span>
                <p>
                  {t("services.p27")}{" "}
                  <strong className="bold">{t("services.b27")}</strong>{" "}
                  {t("services.p28")}
                </p>
              </span>
              <p> {t("services.p29")}</p>
              <h3>{t("services.subtitle10")}</h3>
              <p>{t("services.p30")}</p>
              <span>
                <p>
                  {t("services.p31")}{" "}
                  <strong className="bold">{t("services.b31")}</strong>{" "}
                  {t("services.p32")}
                </p>
              </span>
              <span>
                <p>
                  {t("services.p33")}
                  <Link className="gdpr-link" to={`/${lang}/faq`}>
                    {" "}
                    {t("services.link")}
                  </Link>{" "}
                  {t("services.p34")}
                </p>
              </span>
            </div>
            <img className="services-img garden" src={garden} alt="Garden" />
          </div>
          <p className="s-bottom">
            <strong className="bold"> {t("services.b34")}</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
