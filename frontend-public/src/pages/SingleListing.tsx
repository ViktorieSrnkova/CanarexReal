import BaseForm from "../components/Forms/BaseForm";
import Card from "../components/Listing/Card";
import { useT } from "../i18n";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ListingThumbnail } from "../types/rawApi";
import { getListingById } from "../api/listings";

function SingleListing() {
  const t = useT();
  const { id } = useParams();
  const [listing, setListing] = useState<ListingThumbnail | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);
  if (!listing) return <div>Loading...</div>;
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
  return (
    <>
      <div className="contact gray">
        <h2>{t("form.titleDet")}</h2>
        <h3 className="padded-subtitle">{t("form.subtitleDet")}</h3>
        <div className="details-form">
          <Card {...cardData} />
          <BaseForm from={1} what={2} index={listing.index} />
        </div>
      </div>

      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={1} what={3} />
      </div>
    </>
  );
}

export default SingleListing;
