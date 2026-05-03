import { useNavigate, useParams } from "react-router-dom";
import { useT } from "../i18n";
import Button from "../components/General/Button";
import "../styles/pages/istingUnavailable.css";
import { useEffect, useState } from "react";
import { getSimilarListings } from "../api/listings";
import Carrousel from "../components/Listing/Carrousel";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import type { ListingThumbnail } from "../types/rawApi";
import SEO from "../components/SEO/Meta";

export function ListingUnavailable() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const [similar, setSimilar] = useState<ListingThumbnail[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  useEffect(() => {
    if (!id) return;

    const loadSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const data = await getSimilarListings(id, langId);
        setSimilar(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, [id, langId]);
  return (
    <>
      <SEO
        title={`${t("listing.notAvailableTitle")} | CanarexReal`}
        description={t("listing.notAvailableText")}
        noindex
      />
      <div className="unavailable">
        <h1>{t("listing.notAvailableTitle")}</h1>

        <p>{t("listing.notAvailableText")}</p>

        <Button onClick={() => navigate(`/${lang}/listings`)}>
          {t("listing.backToListings")}
        </Button>
        <Carrousel
          similar={similar}
          loading={loadingSimilar}
          title={t("similar.title")}
          loadTxt={t("general.loading")}
          errTxt={t("similar.error")}
        />
      </div>
    </>
  );
}
