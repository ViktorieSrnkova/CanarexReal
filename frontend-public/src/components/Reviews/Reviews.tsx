import Button from "../General/Button";
import { useT } from "../../i18n";
import { useLang } from "../../hooks/i18n/useLang";
import "../../styles/reviews.css";
import SingleReview from "./SingleReview";
import RatingStars from "./RatingStars";
import { reviews } from "../../data/reviews.ts";
import { useEffect, useState } from "react";

const generateWhenAgo = (when: Date, locale: "cs" | "sk" | "en"): string => {
  const now = new Date();

  const seconds = Math.floor((when.getTime() - now.getTime()) / 1000);

  const divisions = [
    { amount: 60, unit: "second" as const },
    { amount: 60, unit: "minute" as const },
    { amount: 24, unit: "hour" as const },
    { amount: 30, unit: "day" as const },
    { amount: 12, unit: "month" as const },
    { amount: Number.POSITIVE_INFINITY, unit: "year" as const },
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

  const reviewsArray = Object.values(reviews);
  const averageRating =
    reviewsArray.reduce((sum, review) => sum + review.rating, 0) /
    reviewsArray.length;
  const maxIndex = Math.max(0, reviewsArray.length - visibleCards);
  const totalPositions = maxIndex + 1;
  const CARD_WIDTH = 320;
  const GAP = 32;
  const STEP = CARD_WIDTH + GAP;

  const next = () => {
    setStartIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 780) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 1112) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
          <div className="arrow-left" onClick={prev}></div>
          <div className="cards-viewport">
            <div
              className="cards-wrapper"
              style={{
                transform: `translateX(-${startIndex * STEP}px)`,
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
          <div className="arrow-right" onClick={next}></div>
        </div>
        <div className="crsl-third-row">
          {Array.from({ length: totalPositions }).map((_, i) => (
            <div
              key={i}
              className={`dot ${i === startIndex ? "active" : ""}`}
              onClick={() => setStartIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
