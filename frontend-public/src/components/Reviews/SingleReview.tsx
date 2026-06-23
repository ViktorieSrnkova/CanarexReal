import { useEffect, useRef, useState } from "react";
import "../../styles/reviews.css";
import { useLang } from "../../hooks/i18n/useLang";
import RatingStars from "./RatingStars";
import { useT } from "../../i18n";
type Props = {
  initials: string;
  name: string;
  reviewLink: string;
  when: string;
  rating: number;
  text: {
    OGLang: string;
    OG: string;
    translations: {
      en: string;
      sk: string;
    };
  };
};

function SingleReview(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const t = useT();
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  const { lang } = useLang();
  const translation = props.text.translations[lang as "en" | "sk"];

  const hasTranslation = Boolean(translation);

  const shownText =
    showOriginal || !hasTranslation ? props.text.OG : translation;

  function getPastelColor(name: string) {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);

    return `hsl(${hue}, 70%, 85%)`;
  }
  return (
    <div className="review-container">
      <div className="review-1-line">
        <div
          className="initials-circle"
          style={{
            backgroundColor: getPastelColor(props.name),
          }}
        >
          <h2>{props.initials}</h2>
        </div>

        <div className="who-when">
          <a href={props.reviewLink} className="review-link">
            <h3>{props.name}</h3>
          </a>

          <span className="subtext">{props.when}</span>
        </div>
      </div>

      <div className="review-stars">
        <RatingStars rating={props.rating} />
      </div>

      <div className="review-txt">
        <p
          ref={textRef}
          className={expanded ? "review-text expanded" : "review-text"}
        >
          {shownText}
        </p>

        {isOverflowing && (
          <button
            type="button"
            className="review-read-more"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? t("reviews.showLess") : t("reviews.showMore")}
          </button>
        )}
        {hasTranslation && (
          <div className="translations-row">
            {!showOriginal && (
              <span className="subtext">{t("reviews.translatedWith")} • </span>
            )}
            <button
              className="translations-btn"
              type="button"
              onClick={() => setShowOriginal((v) => !v)}
            >
              {showOriginal
                ? t("reviews.showTranslation")
                : t("reviews.showOriginal")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleReview;
