import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/listing/gallery.css";

type Props = {
  imagesProp: { id: number }[];
};

export default function ListingGallery({ imagesProp }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLImageElement | null>(null);
  const touchStartX = useRef(0);
  const images = useMemo(() => {
    return imagesProp.map(
      (img) => `https://canarexreal.onrender.com/api/files/images/${img.id}`,
    );
  }, [imagesProp]);

  const activeImage = images[activeIndex];

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
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
    <div className="gallery">
      {isOpen && (
        <div className="lightbox" onClick={() => setIsOpen(false)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img src={activeImage} className="lightbox-image" />
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
      <div className="gallery-main">
        <div onClick={prev} className="arrow arrow-left"></div>
        <div className="gallery-image" onClick={() => setIsOpen(true)}>
          <img src={activeImage} alt="" />
        </div>
        <div onClick={next} className="arrow arrow-right"></div>
      </div>

      <div className="gallery-thumbs " ref={thumbsRef}>
        {images.map((img, i) => (
          <img
            key={img + i}
            src={img}
            onClick={() => setActiveIndex(i)}
            ref={i === activeIndex ? activeThumbRef : null}
            className={`thumb ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
