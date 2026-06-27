import { useEffect, useState } from "react";
import Carrousel from "../components/Listing/Carrousel";
import type { ListingThumbnail } from "../types/rawApi";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getListingsThumbsHome } from "../api/listings";
import { useT } from "../i18n";
import Button from "../components/General/Button";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/services.css";
import BaseForm from "../components/Forms/BaseForm";
import SEO from "../components/SEO/Meta";
import stan from "../assets/stan.avif";
import beach from "../assets/beach.avif";
import livingroom from "../assets/livingroom.avif";
import villa from "../assets/villa.avif";
import garden from "../assets/garden.avif";
import { useAuth } from "../Auth/authStore";
import useImagePreloader from "../hooks/useImagePreloader";
import Vlnka from "/general/vlnka-white-gray.svg";
import MobileVlnka from "/general/small-vlnka-white-gray.svg";

const preloadSrcList: string[] = [stan, Vlnka, MobileVlnka];

function Services() {
  useImagePreloader(preloadSrcList);

  const t = useT();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [similar, setSimilar] = useState<ListingThumbnail[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];

  useEffect(() => {
    const loadSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const data = await getListingsThumbsHome(langId);
        setSimilar(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, [langId, user]);

  const list1 = t<string[]>("services.list1");
  const list2 = t<string[]>("services.list2");
  const list3 = t<string[]>("services.list3");
  const list4 = t<string[]>("services.list4");
  const list5 = t<string[]>("services.list5");
  const list6 = t<string[]>("services.list6");
  const list7 = t<string[]>("services.list7");

  return (
    <>
      <SEO
        title={t("SEO.Services_title")}
        description={t("SEO.Services_description")}
        noindex
      />

      <div className="white faq serv beggining">
        <h1>{t("services.title")}</h1>
        <div className="s-first">
          <img
            className="services-img stan pc"
            src={stan}
            alt="Stan Srnka"
            fetchPriority="high"
          />
          <div className="s-text">
            <h2>{t("services.subtitle1")}</h2>
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
            <h2>{t("services.subtitle2")}</h2>
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
      <img
        className="wawe"
        src={Vlnka}
        alt="vlnka-white-to-gray"
        fetchPriority="high"
      />
      <img
        className="wawe mobile"
        src={MobileVlnka}
        alt="vlnka-white-to-gray"
        fetchPriority="high"
      />
      <div className="gray faq serv">
        <div className="s-first">
          <div className="s-text">
            <h2>{t("services.subtitle3")}</h2>
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
            <h2>{t("services.subtitle4")}</h2>
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
            <h2>{t("services.subtitle5")}</h2>
            <p>{t("services.p11")}</p>
            <ul>
              {list4.map((row, i) => (
                <li key={i}>{row}</li>
              ))}
            </ul>
          </div>
          <img className="services-img pc" src={beach} alt="Tenerife beach" />
        </div>
        <div className="s-bottom">
          <p>{t("services.p12")}</p>{" "}
          <strong className="bold">{t("services.b12")}</strong>
        </div>
        <img className="services-img mobile" src={beach} alt="Tenerife beach" />
      </div>
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <img
        className="wawe mobile"
        src="/general/small-vlnka-gray-white.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="white faq serv">
        <div className="s-first">
          <div className="s-text">
            <h2>{t("services.subtitle6")}</h2>
            <p>{t("services.p13")}</p>
            <p>{t("services.p14")}</p>
            <ul>
              <li>
                {t("services.l5_item1_normal")}{" "}
                <strong className="bold">{t("services.l5_item1_bold")}</strong>
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
            <h2>{t("services.subtitle7")}</h2>
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
            <h2>{t("services.subtitle8")}</h2>
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
            <h2>{t("services.subtitle9")}</h2>
            <span>
              <p>
                {t("services.p27")}{" "}
                <strong className="bold">{t("services.b27")}</strong>{" "}
                {t("services.p28")}
              </p>
            </span>
            <p> {t("services.p29")}</p>
            <h2>{t("services.subtitle10")}</h2>
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
                <Link className="gdpr-link" to={"/faq"}>
                  {" "}
                  {t("services.link")}
                </Link>{" "}
                {t("services.p34")}
              </p>
            </span>
          </div>
          <img className="services-img garden" src={garden} alt="Garden" />
        </div>
        <p>
          <strong className="bold"> {t("services.b34")}</strong>
        </p>
      </div>
      <img
        className="wawe"
        src="/general/vlnka-white-gray.svg"
        alt="vlnka-white-to-gray"
      />
      <img
        className="wawe mobile"
        src="/general/small-vlnka-white-gray.svg"
        alt="vlnka-white-to-gray"
      />
      <div className="services gray">
        <Carrousel
          similar={similar}
          loading={loadingSimilar}
          title={t("carrousel.title")}
          loadTxt={t("general.loading")}
          errTxt={t("similar.error")}
        />
        <div className="btn-row">
          <Button onClick={() => navigate(`/${lang}/listings`)}>
            {t("services.more")}
          </Button>
        </div>
      </div>
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <img
        className="wawe mobile"
        src="/general/small-vlnka-gray-white.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={4} what={3} />
      </div>
    </>
  );
}

export default Services;
