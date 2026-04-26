import { useEffect, useState } from "react";
import Card from "../components/Listing/Card";
import type { ListingThumbnail } from "../types/rawApi";
import { getListingsThumbs } from "../api/listings";
import "../styles/pages/listings.css";
import Pagination from "../components/General/Pagination";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";

function Listings() {
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const load = async () => {
      try {
        const { thumbnails, total } = await getListingsThumbs(langId, {
          page,
          limit,
        });
        setListings(thumbnails);
        setTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [page, langId]);
  return (
    <div className="content">
      <div className="listings-wrapper">
        <div className="filters"></div>
        <div className="listings">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          <div className="hp-cards-wrapper">
            {listings.map((listing) => {
              const cardData = {
                id: listing.id,
                titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                lokace: listing.adresy?.lokace ?? "",
                typ:
                  listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                    ?.nazev ?? "",
                status: listing.statusy.statusy_preklady[0].nazev ?? "",
                cena_v_eur: listing.cena_v_eur,
                loznice: listing.loznice,
                koupelny: listing.koupelny,
                velikost: listing.velikost,
                obrazekId: listing.obrazky[0]?.id ?? 0,
                alt: listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
                status_id: listing.statusy_id,
              };

              return <Card key={listing.id} {...cardData} />;
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default Listings;
