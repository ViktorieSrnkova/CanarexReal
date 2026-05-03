import { useEffect, useState } from "react";
import { getListingsThumbsHome } from "../api/listings";
import type { ListingThumbnail } from "../types/rawApi";
import Card from "../components/Listing/Card";
import "../styles/pages/homePage.css";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import Button from "../components/General/Button";
import { useNavigate } from "react-router-dom";
import { useT } from "../i18n";
import hero from "/pages/hero.webp";
import type { CSSProperties } from "react";
import Medalion from "../components/Contact/Medalion";
import "../styles/responsivity/resize.css";
import SEO from "../components/SEO/Meta";
type HeroStyle = CSSProperties & {
  "--hero"?: string;
};

function HomePage() {
  const navigate = useNavigate();
  const t = useT();
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getListingsThumbsHome(langId);
        setListings(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [langId]);

  return (
    <>
      <SEO
        title={t("SEO.HP_title")}
        description={t("SEO.HP_description")}
        schema={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "CanarexReal",
          areaServed: {
            "@type": "Place",
            name: "Tenerife, Spain",
          },
          url: "https://canarex-real-public.vercel.app",
        }}
      />
      <div
        className="hero"
        style={
          {
            "--hero": `url(${hero})`,
          } as HeroStyle
        }
      >
        <h1>{t("homepage.title")}</h1>
        <h2>{t("homepage.subtitle")}</h2>
        <div className="buttons">
          <Button onClick={() => navigate("/listings")}>
            {t("homepage.listings")}
          </Button>
          <Button onClick={() => navigate("/contact")} variant="secondary">
            {t("homepage.contact")}
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
      {!listings.length ? (
        <div>{t("general.loading")}</div>
      ) : (
        <div className="content">
          <div className="hp-cards-wrapper">
            {listings.slice(0, 6).map((listing) => {
              const cardData = {
                id: listing.id,
                titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                lokace: listing.adresy?.lokace ?? "",
                typ:
                  listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                    ?.nazev ?? "",
                status: "NOVÉ",
                cena_v_eur: listing.cena_v_eur,
                loznice: listing.loznice,
                koupelny: listing.koupelny,
                velikost: listing.velikost,
                obrazekId: listing.obrazky[0]?.id ?? 0,
                alt: listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
                status_id: 4,
              };

              return <Card key={listing.id} {...cardData} />;
            })}
          </div>
        </div>
      )}

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
      <img
        className="wawe mobile"
        src="/general/small-vlnka-gray-white.svg"
        alt="vlnka-gray-to-white"
      />
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="hp-contact-wrapper">
        <div className="hp-contact">
          <div className="hp-2-contact pc">
            <p>{t("homepage.servis")}</p>
            <p>{t("homepage.rent")}</p>
          </div>
          <Medalion
            image="/contact/stan.webp"
            alt="Stan Srnka"
            name="Stan Srnka"
            role="Váš realitní agent na Tenerife"
          />
          <div className="hp-2-contact mobile">
            <p>{t("homepage.servis")}</p>
            <p>{t("homepage.rent")}</p>
            <p>{t("homepage.ideal")}</p>
            <p>{t("homepage.manage")}</p>
          </div>
          <div className="hp-2-contact pc ">
            <p>{t("homepage.ideal")}</p>
            <p>{t("homepage.manage")}</p>
          </div>
        </div>
        <div className="buttons">
          <Button onClick={() => navigate("/services")}>
            {t("homepage.services")}
          </Button>
          <Button onClick={() => navigate("/contact")} variant="secondary">
            {t("homepage.contactMe")}
          </Button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
