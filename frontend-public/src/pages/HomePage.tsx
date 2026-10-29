import { useEffect, useMemo, useState } from "react";
import { getListingsThumbsHome } from "../api/listings";
import type { ListingThumbnail } from "../types/rawApi";
import Card from "../components/Listing/Card";
import "../styles/pages/homePage.css";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import Button from "../components/General/Button";
import { useNavigate } from "react-router-dom";
import { useT } from "../i18n";
import Medalion from "../components/Contact/Medalion";
import SEO from "../components/SEO/Meta";
import CardSkeleton from "../components/Listing/SkeletonCard";
import { useAuth } from "../Auth/authStore";
import { addFavorite, removeFavorite } from "../api/favorites";
import toast from "react-hot-toast";
import Reviews from "../components/Reviews/Reviews";
import useImagePreloader from "../hooks/useImagePreloader";
import Wave from "../components/General/Wave";
import Hero from "/pages/hero.webp";

const preloadSrcList: string[] = [Hero];

function HomePage() {
  const navigate = useNavigate();
  const t = useT();
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const { user } = useAuth();

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
  }, [langId, user]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const imageUrls = useMemo(() => {
    if (!listings.length) return null;
    const listingImages = listings
      .slice(0, 2)
      .map((l) => l.obrazky?.[0]?.id)
      .filter(Boolean)
      .map((id) => `${VITE_API_URL}/api/files/images/${id}`);

    return [...preloadSrcList, ...listingImages];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);
  useImagePreloader(imageUrls ?? []);

  async function toggleFavoriteApi(id: number, isFavorite: boolean) {
    if (isFavorite) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
  }
  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    if (!user) {
      toast.error(t("favorites.loginNeeded"));
      return;
    }

    setListings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !isFavorite } : item,
      ),
    );

    try {
      await toggleFavoriteApi(id, isFavorite);
    } catch {
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: isFavorite } : item,
        ),
      );
    }
  };
  const isLoading = !listings.length;
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
      <div className="hero">
        <img
          fetchPriority="high"
          src={Hero}
          alt=""
          className="heroImage"
          loading="eager"
        />

        <div className="heroOverlay" />
        <div className="heroContent">
          <h1>{t("homepage.title")}</h1>
          <h2>{t("homepage.subtitle")}</h2>

          <div className="buttons">
            <Button onClick={() => navigate(`/${lang}/listings`)}>
              {t("homepage.listings")}
            </Button>

            <Button
              onClick={() => navigate(`/${lang}/contact`)}
              variant="secondary"
            >
              {t("homepage.contact")}
            </Button>
          </div>
        </div>
      </div>

      <Wave variant="gray-white" className="wawe gray-wawe " />
      <Wave variant="small-gray-white" className="wawe gray-wawe mobile" />

      <div className="home-page">
        <div className={`hp-cards-wrapper ${isLoading ? "loading" : ""}`}>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}

          {listings.slice(0, 6).map((listing, i) => (
            <Card
              key={listing.index}
              fetchpriority={i < 2}
              favorited={listing.is_favorite}
              onToggleFavorite={() =>
                handleToggleFavorite(listing.id, listing.is_favorite)
              }
              {...{
                index: listing.index,
                titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                lokace: listing.adresy?.lokace ?? "",
                typ:
                  listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                    ?.nazev ?? "",
                status: t("home.status"),
                cena_v_eur: listing.cena_v_eur,
                loznice: listing.loznice,
                koupelny: listing.koupelny,
                velikost: listing.velikost,
                obrazekId: listing.obrazky[0]?.id ?? 0,
                alt: listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
                status_id: 4,
              }}
            />
          ))}
        </div>
      </div>

      <Wave variant="white-gray" className="wawe" />
      <Wave variant="small-white-gray" className="wawe mobile" />

      <div className="hp-reviews gray">
        <Reviews />
      </div>

      <Wave variant="small-gray-white" className="wawe gray-wawe mobile" />
      <Wave variant="gray-white" className="wawe gray-wawe" />

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
            role={t("homepage.agent")}
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
          <Button onClick={() => navigate(`/${lang}/services`)}>
            {t("homepage.services")}
          </Button>
          <Button
            onClick={() => navigate(`/${lang}/contact`)}
            variant="secondary"
          >
            {t("homepage.contactMe")}
          </Button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
