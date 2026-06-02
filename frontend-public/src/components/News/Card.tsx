import "../../styles/newscard.css";

type Props = {
  id?: number;
  img_id?: number;
  alt: string;
  title: string;
};

function Card({ id, img_id, alt, title }: Props) {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  if (!id) {
    return null;
  }
  return (
    <div className="news-card">
      {img_id ? (
        <img
          src={`${VITE_API_URL}/api/files/images/${img_id}`}
          alt={alt ?? ""}
          className="news-img"
        />
      ) : null}
      <h2 className="news-title">{title}</h2>
    </div>
  );
}

export default Card;
