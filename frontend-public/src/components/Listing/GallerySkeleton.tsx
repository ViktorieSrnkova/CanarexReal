import "../../styles/listing/gallery.css";

export default function GallerySkeleton() {
  return (
    <div
      className="gallery gallery--loading gallery--placeholder"
      aria-hidden="true"
    >
      <div className="gallery-main">
        <div className="gallery-image" />
      </div>
      <div className="gallery-thumbs">
        {Array.from({ length: 3 }, (_, i) => (
          <div className="thumb-wrapper" key={i} />
        ))}
      </div>
    </div>
  );
}
