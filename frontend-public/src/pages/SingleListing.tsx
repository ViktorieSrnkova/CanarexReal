import BaseForm from "../components/Forms/BaseForm";
import Card from "../components/Listing/Card";
import { useT } from "../i18n";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type {
  ListingDetailResponse,
  ListingThumbnail,
  Pictogram,
} from "../types/rawApi";
import {
  getListingById,
  getListingDetail,
  getPictogramsForId,
  getSimilarListings,
} from "../api/listings";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import type { AxiosError } from "axios";
import { ListingUnavailable } from "./ListingUnavailable";
import Carrousel from "../components/Listing/Carrousel";
import Pictograms from "../components/Listing/Pictograms";
import { formatMoneyEUR } from "../utils/formatting";
import "../styles/pages/singlelisting.css";
import { useFx } from "../FxContext";
import Tooltip from "../components/General/Tooltip";
import ListingGallery from "../components/Listing/Gallery";

function SingleListing() {
  const t = useT();
  const rates = useFx();
  const { id } = useParams();
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const [listing, setListing] = useState<ListingThumbnail | null>(null);
  const [detail, setDetail] = useState<ListingDetailResponse | null>(null);
  const [notAvailable, setNotAvailable] = useState(false);
  const [similar, setSimilar] = useState<ListingThumbnail[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [pictograms, setPictograms] = useState<Pictogram[]>([]);
  const [hoveredIcon, setHoveredIcon] = useState<"like" | "copy" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getListingById(id, langId);
        setListing(data);
        const data2 = await getListingDetail(id, langId);
        setDetail(data2);
        setNotAvailable(false);
      } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 404) {
          setListing(null);
          setNotAvailable(true);
          return;
        }

        console.error(error);
      }
    };

    load();
  }, [id, langId]);

  const price = useMemo(() => {
    if (!listing) return null;
    if (!rates) return listing.cena_v_eur;

    if (langId === 2) return listing.cena_v_eur * rates.CZK;
    if (langId === 1) return listing.cena_v_eur * rates.GBP;

    return null;
  }, [listing, rates, langId]);

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

  useEffect(() => {
    if (!id) return;
    const fetchPictograms = async () => {
      try {
        const data = await getPictogramsForId(id, langId);
        setPictograms(data);
      } catch (err) {
        console.error("Failed to load pictograms:", err);
        setPictograms([]);
      }
    };

    fetchPictograms();
  }, [id, langId]);

  if (notAvailable) {
    return <ListingUnavailable />;
  }

  if (!listing) {
    return <div>{t("general.loading")}</div>;
  }
  const cardData = {
    id: listing.id,
    titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
    lokace: listing.adresy?.lokace ?? "",
    typ: listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]?.nazev ?? "",
    status: listing.statusy?.statusy_preklady[0]?.nazev ?? "",
    cena_v_eur: listing.cena_v_eur,
    loznice: listing.loznice,
    koupelny: listing.koupelny,
    velikost: listing.velikost,
    obrazekId: listing.obrazky[0]?.id ?? 0,
    alt: listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
    status_id: listing.statusy_id,
  };

  /*   const handleLikeClick = () => {
   if (!user) { 
    // TODO: redirect / modal / toast
    console.log("User must be logged in to like");
    return;
    }

    console.log("LIKE listing:", listing.id); 
  };
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => setCopied(false), 300);
  };
  return (
    <>
      <div className="listing-hero">
        <div className="first-row">
          <h1>{listing.inzeraty_preklady[0]?.titulek}</h1>
          <div className="listing-hero-icons">
            {/*  <div
              onMouseEnter={() => setHoveredIcon("like")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ position: "relative" }}
            >
              <img
                src="/listings/heart.svg"
                onClick={handleLikeClick}
                style={{ cursor: "pointer" }}
                alt="like"
              />
              {hoveredIcon === "like" && (
                <Tooltip message="Přidat do oblíbených" top={-34} left={-84} />
              )}
            </div>
 */}
            <div
              onMouseEnter={() => setHoveredIcon("copy")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ position: "relative" }}
            >
              <img
                onClick={handleCopy}
                src="/listings/copy.svg"
                style={{
                  cursor: "pointer",
                  background: copied ? "#87ceeb" : "",
                  borderRadius: "8px",
                  transition: "background 0.2s ease-out",
                }}
                alt="copy link"
              />
              {hoveredIcon === "copy" && (
                <Tooltip
                  message="Zkopírovat URL inzerátu"
                  top={-34}
                  left={-90}
                />
              )}
            </div>
          </div>
        </div>
        <div className="second-row">
          <h3>
            {` ${listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]?.nazev} ${listing.statusy?.statusy_preklady[0]?.nazev?.toLowerCase()}`}
          </h3>
          <div className="prices ">
            <h3 className="number euro">
              {formatMoneyEUR(listing.cena_v_eur)}
            </h3>

            {price && (
              <h3 className="number czk">
                {"("}
                {price.toLocaleString()}{" "}
                {langId === 2 ? "Kč" : langId === 1 ? "GBP" : "EUR"}
                {")"}
              </h3>
            )}
          </div>
        </div>
      </div>
      <ListingGallery imagesProp={detail?.obrazky ?? []} />
      <div className="pictograms gray ">
        <Pictograms
          pictograms={pictograms}
          bath={listing.koupelny}
          bed={listing.loznice}
          size={`${listing.velikost} m²`}
        />
      </div>
      <img
        className="wawe"
        alt="vlnka-gray-to-white"
        src="/general/vlnka-gray-white-nm.svg"
      ></img>
      <div className="contact gray">
        <h2>{t("form.titleDet")}</h2>
        <h3 className="padded-subtitle">{t("form.subtitleDet")}</h3>
        <div className="details-form">
          <Card {...cardData} />
          <BaseForm from={1} what={2} index={listing.index} />
        </div>
      </div>
      <img
        className="wawe"
        alt="vlnka-gray-to-white"
        src="/general/vlnka-gray-white-nm.svg"
      ></img>
      <Carrousel
        similar={similar}
        loading={loadingSimilar}
        title={t("similar.title")}
        loadTxt={t("general.loading")}
        errTxt={t("similar.error")}
      />
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={1} what={3} />
      </div>
    </>
  );
}

export default SingleListing;
