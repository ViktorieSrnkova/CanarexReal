import { useEffect, useState } from "react";
import Card from "./Card";
import type { ListingThumbnail } from "../../types/rawApi";
import "../../styles/listing/carrousel.css";
import CardSkeleton from "./SkeletonCard";
import toast from "react-hot-toast";
import { useAuth } from "../../Auth/authStore";
import { addFavorite, removeFavorite } from "../../api/favorites";
import { useT } from "../../i18n";

type Props = {
  similar: ListingThumbnail[];
  loading: boolean;
  title: string;
  loadTxt: string;
  errTxt: string;
};

function Carrousel(props: Props) {
  const [items, setItems] = useState<ListingThumbnail[]>(props.similar);
  const [startIndex, setStartIndex] = useState(0);
  const total = items.length;
  const [visibleCount, setVisibleCount] = useState(3);
  const isEmpty = total === 0;
  const { user } = useAuth();
  const t = useT();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(props.similar);
  }, [props.similar]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 1162) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const mapCard = (sim: ListingThumbnail) => ({
    id: sim.id,
    titulek: sim.inzeraty_preklady[0]?.titulek ?? "",
    lokace: sim.adresy?.lokace ?? "",
    typ: sim.typy_nemovitosti?.typy_nemovitosti_preklady[0]?.nazev ?? "",
    status: sim.statusy?.statusy_preklady?.[0]?.nazev ?? "",
    cena_v_eur: sim.cena_v_eur,
    loznice: sim.loznice,
    koupelny: sim.koupelny,
    velikost: sim.velikost,
    obrazekId: sim.obrazky?.[0]?.id ?? 0,
    alt: sim.obrazky?.[0]?.obrazky_preklady?.[0]?.alt_text ?? "",
    status_id: sim.statusy_id,
  });

  const getVisibleItems = () => {
    if (items.length === 0) return [];

    return Array.from({ length: visibleCount }).map((_, i) => {
      const index = (startIndex + i) % items.length;
      return items[index];
    });
  };
  const shouldDisableCarousel = total <= visibleCount;

  const visibleItems = shouldDisableCarousel ? items : getVisibleItems();
  const next = () => {
    if (!items.length) return;
    setStartIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    if (!items.length) return;
    setStartIndex((prev) => (prev - 1 + items.length) % items.length);
  };
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

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !isFavorite } : item,
      ),
    );

    try {
      await toggleFavoriteApi(id, isFavorite);
    } catch {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_favorite: isFavorite } : item,
        ),
      );
    }
  };
  if (props.loading) {
    return (
      <div className="crsl-wrapper">
        <div className="crsl-first-row">
          <h2>{props.title}</h2>
        </div>

        <div className="crsl-second-row">
          <div className="arrow-left" />
          <div className="crsl-listings-wrapper">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="arrow-right" />
        </div>
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="crsl-wrapper">
        <div className="crsl-first-row">
          <h2>{props.title}</h2>
        </div>

        <div className="crsl-second-row">
          <p>{props.errTxt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crsl-wrapper">
      <div className="crsl-first-row">
        <h2>{props.title}</h2>
      </div>

      <div className="crsl-second-row">
        {!shouldDisableCarousel && (
          <div className="arrow-left" onClick={prev} />
        )}

        <div className="crsl-listings-wrapper">
          {visibleItems.map((sim) => (
            <Card
              key={sim.id}
              favorited={sim.is_favorite}
              onToggleFavorite={() =>
                handleToggleFavorite(sim.id, sim.is_favorite)
              }
              {...mapCard(sim)}
            />
          ))}
        </div>

        {!shouldDisableCarousel && (
          <div className="arrow-right" onClick={next} />
        )}
      </div>

      {!shouldDisableCarousel && (
        <div className="crsl-third-row">
          {items.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === startIndex ? "active" : ""}`}
              onClick={() => setStartIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carrousel;
