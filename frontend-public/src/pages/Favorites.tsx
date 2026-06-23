import { useEffect, useState } from "react";
import Pagination from "../components/General/Pagination";
import Card from "../components/Listing/Card";
import CardSkeleton from "../components/Listing/SkeletonCard";
import { useListings } from "../hooks/useListings";
import "../styles/pages/listings.css";
import type { ListingThumbnail } from "../types/rawApi";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getFavoritesList, removeFavorite } from "../api/favorites";
import ConfirmModal from "../components/General/ConfirmModal";
import "../styles/pages/favorites.css";
import { useT } from "../i18n";

function Favorites() {
  const { page, setPage } = useListings({
    paginated: true,
  });
  const t = useT();
  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const limit = 6;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const { thumbnails, total } = await getFavoritesList(
          langId,
          page,
          limit,
        );

        setListings(thumbnails);
        setTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [page, langId]);
  const openRemoveModal = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };
  const confirmRemove = async () => {
    if (!selectedId) return;

    try {
      await removeFavorite(selectedId);

      const { thumbnails, total } = await getFavoritesList(langId, page, limit);

      setListings(thumbnails);
      setTotal(total);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };
  return (
    <>
      <div className="faq">
        <h1>Oblíbené inzeráty</h1>
      </div>
      <div className="listings favorites">
        {listings.length === 0 ? (
          <div className="hp-cards-wrapper">
            {Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="hp-cards-wrapper" style={{ maxWidth: "68.75rem" }}>
            {listings.map((listing, i) => {
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

              return (
                <Card
                  fetchpriority={i < 2}
                  key={listing.id}
                  favorited={listing.is_favorite}
                  onToggleFavorite={() => openRemoveModal(listing.id)}
                  {...cardData}
                />
              );
            })}
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          title={t("favorites.confirm")}
          confirmText={t("favorites.ok")}
          cancelText={t("favorites.cancel")}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedId(null);
          }}
          onConfirm={confirmRemove}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </>
  );
}

export default Favorites;
