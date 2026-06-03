import { Link } from "react-router-dom";
import "../../styles/newscard.css";
import { useLang } from "../../hooks/i18n/useLang";

type Props = {
  id?: number;
  img_id?: number;
  alt: string;
  title: string;
};

function Card({ id, img_id, alt, title }: Props) {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { lang } = useLang();
  if (!id) {
    return null;
  }
  return (
    <div className="news-card">
      <Link to={`/${lang}/news/${id}`} className="news-card-link">
        {img_id ? (
          <img
            src={`${VITE_API_URL}/api/files/images/${img_id}`}
            alt={alt ?? ""}
            className="news-img"
          />
        ) : null}
        <h2 className="news-title">{title}</h2>
      </Link>
    </div>
  );
}

export default Card;
