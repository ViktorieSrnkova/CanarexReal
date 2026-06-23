import "../../styles/stars.css";

type Props = {
  rating: number;
  size?: number;
};

function RatingStars({ rating, size = 20 }: Props) {
  return (
    <div className="wrapper-rating-stars">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));

        return (
          <div
            key={i}
            className="star-wrapper"
            style={{
              width: size,
              height: size,
            }}
          >
            <div className="star-fill" style={{ width: `${fill * 100}%` }}>
              <img src="/general/star.svg" alt="" width={size} height={size} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RatingStars;
