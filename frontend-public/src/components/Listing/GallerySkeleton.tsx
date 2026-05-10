import "../../styles/listing/gallery.css";
function GallerySkeleton() {
  return (
    <div className="gallery skeleton-gallery-wrapper">
      <div className="gallery-main">
        <div className="arrow arrow-left" />

        <div className="gallery-image skeleton-block" />

        <div className="arrow arrow-right" />
      </div>

      <div className="gallery-thumbs">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="thumb skeleton" />
        ))}
      </div>
    </div>
  );
}

export default GallerySkeleton;
