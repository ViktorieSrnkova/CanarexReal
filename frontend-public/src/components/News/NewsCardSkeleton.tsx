import "../../styles/components/newscard-skeleton.css";

function NewsCardSkeleton() {
  return (
    <div className="news-card news-card-skeleton">
      <div className="news-card-skeleton-image">
        <div className="image-shimmer" />
      </div>

      <div className="title-wrapper skeleton-title-wrapper">
        <div className="news-card-skeleton-title">
          <div className="news-card-skeleton-line" />
          <div className="news-card-skeleton-line short" />
        </div>
      </div>
    </div>
  );
}

export default NewsCardSkeleton;
