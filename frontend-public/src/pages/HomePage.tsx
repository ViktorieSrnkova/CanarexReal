import { useEffect, useState } from "react";
import { getListingsThumbsHome } from "../api/listings";
import type { ListingThumbnail } from "../types/rawApi";
import Card from "../components/Listing/Card";
import "../styles/pages/homePage.css";

function HomePage() {
  const [listings, setListings] = useState<ListingThumbnail[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getListingsThumbsHome();
        setListings(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);
  if (!listings.length) return <div>Loading...</div>;
  return (
    <div className="content">
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="hp-cards-wrapper">
        {listings.slice(0, 6).map((listing) => {
          const cardData = {
            id: listing.id,
            titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
            lokace: listing.adresy?.lokace ?? "",
            typ:
              listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]?.nazev ??
              "",
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

      <img
        className="wawe"
        src="/general/vlnka-white-gray.svg"
        alt="vlnka-white-to-gray"
      />
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
    </div>
  );
}

export default HomePage;
