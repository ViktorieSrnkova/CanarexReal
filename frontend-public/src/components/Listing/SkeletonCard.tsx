import "../../styles/listing/skeletonCard.css";

function CardSkeleton() {
  return (
    <div className="card skeleton-card">
      <div className="card-image skeleton-block">
        <div className="card-status skeleton-status" />
      </div>

      <div className="skeleton-card-first-row">
        <div className="card-location">
          <div className="skeleton-icon skeleton-block" />
          <div className="skeleton-text skeleton-block" />
        </div>

        <div className="card-icons">
          <div className="skeleton-icon skeleton-block" />
          <div className="skeleton-number skeleton-block" />

          <div className="skeleton-icon skeleton-block" />
          <div className="skeleton-number skeleton-block" />

          <div className="skeleton-icon skeleton-block" />
          <div className="skeleton-number skeleton-block" />
        </div>
      </div>

      <div className="card-second-row">
        <div className="skeleton-title skeleton-block" />
      </div>

      <div className="card-third-row">
        <div className="skeleton-text medium skeleton-block" />
        <div className="skeleton-price skeleton-block" />
      </div>
    </div>
  );
}

export default CardSkeleton;
