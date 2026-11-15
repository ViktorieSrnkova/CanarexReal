import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  TouchEvent as ReactTouchEvent,
  TransitionEvent as ReactTransitionEvent,
} from "react";

import "../../styles/listing/gallery.css";
import ShimmerLoader from "../General/ShimmerLoader";

type GalleryProp = {
  id: number;
  mimeType?: string;
  alt: string;
};

type Props = {
  imagesProp: GalleryProp[];
  index: number;
};

const VITE_API_URL = import.meta.env.VITE_API_URL;
const SWIPE_DURATION = 300;

export default function ListingGallery({ imagesProp, index }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Lightbox swipe
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);

  const activeThumbRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeWidth = useRef(1);
  const dragXRef = useRef(0);
  const swipeDirection = useRef(0);
  const swipeAnimating = useRef(false);
  const gestureAxis = useRef<"x" | "y" | null>(null);
  const resetFrame = useRef<number | null>(null);
  const unlockFrame = useRef<number | null>(null);

  const images = useMemo(
    () =>
      imagesProp.map((img) => ({
        id: img.id,
        url: `${VITE_API_URL}/api/files/images/${img.id}`,
        mimeType: img.mimeType,
        alt: img.alt,
      })),
    [imagesProp],
  );

  const count = images.length;
  const safeIndex = count ? activeIndex % count : 0;
  const activeImage = images[safeIndex];

  const previousIndex = count ? (safeIndex - 1 + count) % count : 0;

  const nextIndex = count ? (safeIndex + 1) % count : 0;

  const prev = useCallback(() => {
    if (count < 2 || swipeAnimating.current) return;
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    if (count < 2 || swipeAnimating.current) return;
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  // Posouvání aktivní miniatury do viditelné oblasti
  useLayoutEffect(() => {
    if (!activeThumbRef.current) return;

    const frame = requestAnimationFrame(() => {
      activeThumbRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [safeIndex]);

  // Zamčení scrollování při otevřeném lightboxu
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Načtení první fotografie pro skeleton

  useEffect(() => {
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(false);

    if (!images.length) return;

    const first = images[0];

    if (first.mimeType?.startsWith("video/")) {
      setLoaded(true);
      return;
    }

    const img = new Image();

    const finish = () => {
      if (!cancelled) setLoaded(true);
    };

    img.onload = finish;
    img.onerror = finish;
    img.src = first.url;

    if (img.complete) {
      finish();
    }

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [images]);

  // Klávesnice v lightboxu
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, next, prev]);

  // Swipe na hlavní galerii mimo lightbox
  const onTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: ReactTouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diffX) < 50) return;
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    if (diffX > 0) prev();
    else next();
  };

  // Zahájení swipe v lightboxu
  const handleSwipeStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (swipeAnimating.current || count < 2) return;

    // Nezasahovat do ovládání videa
    if (e.target instanceof HTMLElement && e.target.closest("video")) {
      return;
    }

    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
    swipeWidth.current = e.currentTarget.clientWidth;

    gestureAxis.current = null;
    dragXRef.current = 0;

    setDragX(0);
    setIsDragging(true);
  };

  const handleSwipeMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isDragging || swipeAnimating.current) return;

    const diffX = e.touches[0].clientX - swipeStartX.current;
    const diffY = e.touches[0].clientY - swipeStartY.current;

    // Rozpoznání směru gesta
    if (!gestureAxis.current) {
      if (Math.abs(diffX) < 8 && Math.abs(diffY) < 8) {
        return;
      }

      gestureAxis.current = Math.abs(diffX) > Math.abs(diffY) ? "x" : "y";
    }

    if (gestureAxis.current !== "x") return;

    dragXRef.current = diffX;
    setDragX(diffX);
  };

  const handleSwipeEnd = () => {
    if (!isDragging || swipeAnimating.current) return;

    setIsDragging(false);

    if (gestureAxis.current !== "x") {
      dragXRef.current = 0;
      setDragX(0);
      return;
    }

    const distance = dragXRef.current;
    const threshold = Math.min(80, swipeWidth.current * 0.2);

    gestureAxis.current = null;

    // Krátké tažení: fotka se vrátí na místo
    if (Math.abs(distance) < threshold) {
      dragXRef.current = 0;
      setDragX(0);
      return;
    }

    // -1 = předchozí, +1 = následující
    const direction = distance < 0 ? 1 : -1;

    swipeDirection.current = direction;
    swipeAnimating.current = true;

    setIsAnimating(true);
    setDragX(-direction * swipeWidth.current);
  };

  // Po dokončení animace přepneme index
  // a bez animace přesuneme track zpět doprostřed.
  const handleSlideTransitionEnd = (
    e: ReactTransitionEvent<HTMLDivElement>,
  ) => {
    if (e.target !== e.currentTarget) return;
    if (!swipeAnimating.current) return;

    const direction = swipeDirection.current;

    setDisableTransition(true);

    setActiveIndex((i) => (i + direction + count) % count);

    dragXRef.current = 0;
    setDragX(0);
    setIsAnimating(false);

    if (resetFrame.current !== null) {
      cancelAnimationFrame(resetFrame.current);
    }

    if (unlockFrame.current !== null) {
      cancelAnimationFrame(unlockFrame.current);
    }

    resetFrame.current = requestAnimationFrame(() => {
      unlockFrame.current = requestAnimationFrame(() => {
        setDisableTransition(false);
        swipeAnimating.current = false;
      });
    });
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setDragX(0);
    setIsDragging(false);
    setIsAnimating(false);
    setDisableTransition(false);

    dragXRef.current = 0;
    gestureAxis.current = null;
    swipeAnimating.current = false;
  };

  useEffect(() => {
    return () => {
      if (resetFrame.current !== null) {
        cancelAnimationFrame(resetFrame.current);
      }

      if (unlockFrame.current !== null) {
        cancelAnimationFrame(unlockFrame.current);
      }
    };
  }, []);

  if (!count) return null;

  return (
    <div className={`gallery ${!loaded ? "gallery--loading" : ""}`}>
      {isOpen && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie fotografií"
        >
          <div
            className="lightbox-content lightbox-slider"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleSwipeStart}
            onTouchMove={handleSwipeMove}
            onTouchEnd={handleSwipeEnd}
            onTouchCancel={handleSwipeEnd}
          >
            <div
              className="lightbox-track"
              style={{
                transform: `translate3d(calc(-100% + ${dragX}px), 0, 0)`,
                transition:
                  isDragging || disableTransition
                    ? "none"
                    : `transform ${SWIPE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
              onTransitionEnd={handleSlideTransitionEnd}
            >
              {[previousIndex, safeIndex, nextIndex].map(
                (imageIndex, position) => {
                  const image = images[imageIndex];
                  const isCurrent = position === 1;

                  return (
                    <div
                      className="lightbox-slide"
                      key={`${position}-${image.id}`}
                    >
                      {image.mimeType?.startsWith("video/") ? (
                        <video
                          src={image.url}
                          controls={isCurrent}
                          playsInline
                          autoPlay={isCurrent && !isDragging && !isAnimating}
                          preload="metadata"
                          className="lightbox-image"
                        />
                      ) : (
                        <img
                          src={image.url}
                          alt={image.alt || ""}
                          className="lightbox-image"
                          draggable={false}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                className="arrow arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Předchozí fotografie"
              />

              <button
                type="button"
                className="arrow arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Další fotografie"
              />
            </>
          )}

          <button
            type="button"
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Zavřít galerii"
          >
            ×
          </button>
        </div>
      )}

      <div
        className="gallery-main"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <p className="abs-index number">ID: {index}</p>

        <div className="gallery-image" onClick={() => setIsOpen(true)}>
          {activeImage.mimeType?.startsWith("video/") ? (
            <video
              src={activeImage.url}
              controls
              playsInline
              preload="metadata"
              className="gallery-media"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={activeImage.url}
              className="gallery-media"
              alt={activeImage.alt || ""}
            />
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="gallery-nav gallery-nav-prev"
              aria-label="Předchozí fotografie"
            >
              <span aria-hidden="true">‹</span>
            </button>

            <button
              type="button"
              onClick={next}
              className="gallery-nav gallery-nav-next"
              aria-label="Další fotografie"
            >
              <span aria-hidden="true">›</span>
            </button>

            <div className="gallery-counter">
              {safeIndex + 1} / {count}
            </div>
          </>
        )}
      </div>

      <div className="gallery-thumbs">
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`thumb-wrapper ${i === safeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(i)}
            ref={i === safeIndex ? activeThumbRef : null}
          >
            {img.mimeType?.startsWith("video/") ? (
              <>
                <video
                  src={img.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="thumb"
                />
                <div className="video-play-icon">▶</div>
              </>
            ) : (
              <ShimmerLoader
                key={img.url}
                loading="lazy"
                src={img.url}
                alt={img.alt || ""}
                className="thumb"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
