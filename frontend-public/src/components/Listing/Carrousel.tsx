import { useEffect, useRef, useState } from "react";
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
  const [visibleCount, setVisibleCount] = useState(3);
  const [cardStep, setCardStep] = useState(352);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 800,
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const hintPlayed = useRef(false);
  const userInteracted = useRef(false);

  const { user } = useAuth();
  const t = useT();

  const total = items.length;
  const isEmpty = total === 0;

  const maxIndex = Math.max(0, total - visibleCount);
  const totalPositions = maxIndex + 1;
  const shouldDisableCarousel = total <= visibleCount;

  // Sync items with props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(props.similar);
  }, [props.similar]);

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 800;

      setIsMobile(mobile);
      setVisibleCount(mobile ? 1 : window.innerWidth <= 1162 ? 2 : 3);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Measure distance between cards
  useEffect(() => {
    if (props.loading || isEmpty) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateCardStep = () => {
      const cards = viewport.querySelectorAll<HTMLElement>(
        ".listing-carousel-item",
      );

      const firstCard = cards[0];
      const secondCard = cards[1];

      if (!firstCard) return;

      if (secondCard) {
        setCardStep(
          secondCard.getBoundingClientRect().left -
            firstCard.getBoundingClientRect().left,
        );
      } else {
        setCardStep(firstCard.getBoundingClientRect().width);
      }
    };

    updateCardStep();

    const observer = new ResizeObserver(updateCardStep);

    observer.observe(viewport);

    const firstCard = viewport.querySelector<HTMLElement>(
      ".listing-carousel-item",
    );

    if (firstCard) {
      observer.observe(firstCard);
    }

    return () => observer.disconnect();
  }, [isMobile, props.loading, isEmpty, total]);

  // Keep index valid
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Desktop navigation
  const next = () => {
    userInteracted.current = true;
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    userInteracted.current = true;
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Pagination navigation
  const goToIndex = (index: number) => {
    userInteracted.current = true;
    setShowSwipeHint(false);

    if (isMobile && viewportRef.current) {
      const cards = viewportRef.current.querySelectorAll<HTMLElement>(
        ".listing-carousel-item",
      );

      const viewport = viewportRef.current;
      const card = cards[index];

      if (card) {
        const target =
          card.offsetLeft -
          viewport.offsetLeft -
          (viewport.clientWidth - card.offsetWidth) / 2;

        viewport.scrollTo({
          left: target,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }
    }

    setStartIndex(index);
  };

  // Update active dot on mobile swipe
  const handleMobileScroll = () => {
    if (!isMobile || !viewportRef.current) return;

    const viewport = viewportRef.current;
    const cards = viewport.querySelectorAll<HTMLElement>(
      ".listing-carousel-item",
    );

    if (!cards.length) return;

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft - viewport.offsetLeft + card.offsetWidth / 2;

      const distance = Math.abs(viewportCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setStartIndex(closestIndex);
  };

  // One-time mobile swipe hint
  useEffect(() => {
    if (!isMobile || hintPlayed.current || props.loading) return;
    if (total <= 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.6 &&
          !hintPlayed.current &&
          !userInteracted.current
        ) {
          if (timeout) return;

          timeout = setTimeout(() => {
            timeout = null;

            if (
              hintPlayed.current ||
              userInteracted.current ||
              viewport.scrollLeft > 5
            ) {
              return;
            }

            hintPlayed.current = true;
            setShowSwipeHint(true);

            observer.disconnect();
          }, 2000);
        } else {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
        }
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(viewport);

    return () => {
      observer.disconnect();

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isMobile, props.loading, total]);

  // Map listing to Card props
  const mapCard = (sim: ListingThumbnail) => ({
    index: sim.index,
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

  return (
    <div className="crsl-wrapper">
      <div className="crsl-first-row">
        <h2>{props.title}</h2>
      </div>

      {props.loading ? (
        <div className="crsl-second-row">
          <div className="crsl-listings-wrapper">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div className="listing-carousel-item" key={i}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ) : isEmpty ? (
        <div className="crsl-second-row">
          <p>{props.errTxt}</p>
        </div>
      ) : (
        <>
          <div className="crsl-second-row">
            <div
              ref={viewportRef}
              className="listing-cards-viewport"
              onScroll={handleMobileScroll}
              onTouchStart={() => {
                userInteracted.current = true;
                setShowSwipeHint(false);
              }}
              onPointerDown={() => {
                userInteracted.current = true;
                setShowSwipeHint(false);
              }}
            >
              <div
                className={`crsl-listings-wrapper ${
                  showSwipeHint ? "swipe-hint" : ""
                }`}
                style={{
                  transform: isMobile
                    ? "none"
                    : `translateX(-${startIndex * cardStep}px)`,
                }}
              >
                {items.map((sim) => (
                  <div className="listing-carousel-item" key={sim.id}>
                    <Card
                      favorited={sim.is_favorite}
                      onToggleFavorite={() =>
                        handleToggleFavorite(sim.id, sim.is_favorite)
                      }
                      {...mapCard(sim)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!shouldDisableCarousel && (
            <div className="crsl-third-row">
              {!isMobile && (
                <button
                  type="button"
                  className="listing-arrow-left"
                  onClick={prev}
                  aria-label="Previous listing"
                />
              )}

              <div className="listing-pagination-dots">
                {Array.from({ length: totalPositions }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`listing-dot ${
                      i === startIndex ? "active" : ""
                    }`}
                    onClick={() => goToIndex(i)}
                    aria-label={`Go to listing ${i + 1}`}
                    aria-current={i === startIndex ? "true" : undefined}
                  />
                ))}
              </div>

              {!isMobile && (
                <button
                  type="button"
                  className="listing-arrow-right"
                  onClick={next}
                  aria-label="Next listing"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Carrousel;
