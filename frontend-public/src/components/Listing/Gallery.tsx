import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/listing/gallery.css";

type Props = {
  imagesProp: { id: number }[];
};

export default function ListingGallery({ imagesProp }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const activeThumbRef = useRef<HTMLImageElement | null>(null);

  const images = useMemo(() => {
    return imagesProp.map(
      (img) => `http://localhost:3000/api/files/images/${img.id}`,
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
  if (!images.length) return null;

  const prev = () => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="gallery">
      <div className="gallery-main">
        <div onClick={prev} className="arrow arrow-left"></div>
        <div className="gallery-image">
          <img src={activeImage} alt="" />
        </div>
        <div onClick={next} className="arrow arrow-right"></div>
      </div>

      <div className="gallery-thumbs" ref={thumbsRef}>
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
