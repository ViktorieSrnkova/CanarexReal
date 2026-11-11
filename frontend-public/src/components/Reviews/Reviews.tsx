import Button from "../General/Button";
import { useT } from "../../i18n";
import { useLang } from "../../hooks/i18n/useLang";
import "../../styles/reviews.css";
import SingleReview from "./SingleReview";
import RatingStars from "./RatingStars";
import { reviews } from "../../data/reviews.ts";
import { useEffect, useRef, useState } from "react";

const generateWhenAgo = (when: Date, locale: "cs" | "sk" | "en"): string => {
  const now = new Date();
  const seconds = Math.floor((when.getTime() - now.getTime()) / 1000);

  const divisions = [
    { amount: 60, unit: "second" as const },
    { amount: 60, unit: "minute" as const },
    { amount: 24, unit: "hour" as const },
    { amount: 30, unit: "day" as const },
    { amount: 12, unit: "month" as const },
    {
      amount: Number.POSITIVE_INFINITY,
      unit: "year" as const,
    },
  ];

  let duration = seconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      const formatter = new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      });

      return formatter.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return "";
};

function Reviews() {
  const t = useT();
  const { lang } = useLang();

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [cardStep, setCardStep] = useState(352);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 780,
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const hintPlayed = useRef(false);
  const userInteracted = useRef(false);

  const reviewsArray = Object.values(reviews);

  const averageRating =
    reviewsArray.reduce((sum, review) => sum + review.rating, 0) /
    reviewsArray.length;

  const maxIndex = Math.max(0, reviewsArray.length - visibleCards);

  const totalPositions = maxIndex + 1;

  // Desktop arrows
  const next = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Responsive card count
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 780;

      setIsMobile(mobile);
      setVisibleCards(mobile ? 1 : window.innerWidth <= 1112 ? 2 : 3);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateCardStep = () => {
      const firstCard =
        viewport.querySelector<HTMLElement>(".review-container");

      const secondCard = firstCard?.nextElementSibling as HTMLElement | null;

      if (!firstCard) return;

      if (secondCard) {
        setCardStep(secondCard.offsetLeft - firstCard.offsetLeft);
      } else {
        setCardStep(firstCard.getBoundingClientRect().width);
      }
    };

    updateCardStep();

    const observer = new ResizeObserver(updateCardStep);

    observer.observe(viewport);

    return () => observer.disconnect();
  }, [isMobile]);

  // Keep index within valid bounds
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Scroll to review when pagination dot is clicked
  const goToIndex = (index: number) => {
    userInteracted.current = true;

    if (isMobile && viewportRef.current) {
      const cards = viewportRef.current.querySelectorAll(".review-container");

      cards[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    setStartIndex(index);
  };

  // Update active dot when user swipes
  const handleMobileScroll = () => {
    if (!isMobile || !viewportRef.current) return;

    const viewport = viewportRef.current;
    const cards = viewport.querySelectorAll<HTMLElement>(".review-container");

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

  // One-time swipe hint

  useEffect(() => {
    if (!isMobile || hintPlayed.current) return;
    if (reviewsArray.length <= 1) return;

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
          // Carousel has been visible for 2 seconds
          timeout = setTimeout(() => {
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
          // User scrolled away before 2 seconds
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
  }, [isMobile, reviewsArray.length]);

  return (
    <div className="reviews-wrapper">
      <div className="top-section">
        <div className="left-section">
          <h2>{t("reviews.title")}</h2>

          <div className="overall-rating">
            <h2 className="number">{averageRating.toFixed(1)}</h2>

            <div className="review-stars">
              <RatingStars rating={averageRating} size={29} />
            </div>
          </div>
        </div>

        <a
          href="https://www.google.com/search?hl=en-CZ&gl=cz&q=CanarexReal,+Av.+Quinto+Centenario,+60,+38683+Puerto+de+Santiago,+Santa+Cruz+de+Tenerife,+Spain&ludocid=3879647380012482425&lsig=AB86z5X1Oz8fDXejStL1iWSbqwd0#lrd=0x274fd6e410e09499:0x35d746bca36b3f79,3"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button variant="primary" className="w-600">
            {t("reviews.button")}
          </Button>
        </a>
      </div>

      <div className="review-carrousel">
        <div className="carrousel-wrapper">
          <div
            ref={viewportRef}
            className="cards-viewport"
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
              className={`cards-wrapper ${showSwipeHint ? "swipe-hint" : ""}`}
              style={{
                transform: isMobile
                  ? "none"
                  : `translateX(-${startIndex * cardStep}px)`,
              }}
            >
              {reviewsArray.map((review) => (
                <SingleReview
                  key={review.reviewLink}
                  isOverflowing={review.isOverflowing}
                  reviewLink={review.reviewLink}
                  name={review.name}
                  initials={review.initials}
                  rating={review.rating}
                  text={review.text}
                  when={generateWhenAgo(review.when, lang)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="crsl-third-row">
          {!isMobile && (
            <button
              type="button"
              className="arrow-left"
              onClick={prev}
              aria-label="Previous review"
            />
          )}

          <div className="pagination-dots">
            {Array.from({ length: totalPositions }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={`dot ${i === startIndex ? "active" : ""}`}
                onClick={() => goToIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === startIndex ? "true" : undefined}
              />
            ))}
          </div>

          {!isMobile && (
            <button
              type="button"
              className="arrow-right"
              onClick={next}
              aria-label="Next review"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
