import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../../styles/listing/gallery.css";
import GallerySkeleton from "./GallerySkeleton";

type GalleryProp = {
  id: number;
  mimeType?: string;
  alt: string;
};

type Props = {
  imagesProp: GalleryProp[];
};
const VITE_API_URL = import.meta.env.VITE_API_URL;
export default function ListingGallery({ imagesProp }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLImageElement | null>(null);
  const touchStartX = useRef(0);
  const images = useMemo(() => {
    return imagesProp.map((img) => ({
      id: img.id,
      url: `${VITE_API_URL}/api/files/images/${img.id}`,
      mimeType: img.mimeType,
      alt: img.alt,
    }));
  }, [imagesProp]);

  const activeImage = useMemo(() => images[activeIndex], [images, activeIndex]);
  useLayoutEffect(() => {
    if (!activeThumbRef.current) return;

    const id = requestAnimationFrame(() => {
      activeThumbRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });

    return () => cancelAnimationFrame(id);
  }, [activeIndex]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!images.length) return;

    const first = images[0];

    if (first.mimeType?.startsWith("video/")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
      return;
    }

    const img = new Image();

    img.src = first.url;

    img.onload = () => {
      setLoaded(true);
    };
  }, [images]);
  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, next, prev]);

  if (!images.length) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 50) prev();
    if (diff < -50) next();
  };
  return (
    <div className="gallery" style={{ position: "relative" }}>
      {!loaded && (
        <div className="gallery-skeleton-overlay">
          <GallerySkeleton />
        </div>
      )}

      {isOpen && (
        <div className="lightbox" onClick={() => setIsOpen(false)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {activeImage.mimeType?.startsWith("video/") ? (
              <video
                src={activeImage.url}
                controls
                playsInline
                preload="metadata"
                className="lightbox-image"
              />
            ) : (
              <img
                fetchPriority="high"
                src={activeImage.url}
                className="lightbox-image"
              />
            )}
          </div>

          <div
            className="arrow arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          />
          <div
            className="arrow arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          />

          <div className="lightbox-close" onClick={() => setIsOpen(false)}>
            ×
          </div>
        </div>
      )}
      <div style={{ opacity: loaded ? 1 : 0 }} className="gallery-main">
        <div onClick={prev} className="arrow arrow-left"></div>
        <div className="gallery-image" onClick={() => setIsOpen(true)}>
          {activeImage.mimeType?.startsWith("video/") ? (
            <video
              src={activeImage.url}
              controls
              playsInline
              autoPlay
              className="lightbox-image"
            />
          ) : (
            <img
              fetchPriority="high"
              src={activeImage.url}
              className="lightbox-image"
              alt=""
            />
          )}
        </div>
        <div onClick={next} className="arrow arrow-right"></div>
      </div>

      <div className="gallery-thumbs " ref={thumbsRef}>
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`thumb-wrapper ${i === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(i)}
            ref={i === activeIndex ? activeThumbRef : null}
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
              <img
                loading="lazy"
                src={img.url}
                alt=""
                className={`thumb ${i === activeIndex ? "active" : ""}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
