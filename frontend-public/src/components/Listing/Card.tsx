import { Link } from "react-router-dom";
import "../../styles/listing/card.css";
import { formatMoneyEUR } from "../../utils/formatting";
import { useLang } from "../../hooks/i18n/useLang";
import Favorite from "../General/Favorite";

type Props = {
  id: number;
  titulek: string;
  lokace: string;
  typ: string;
  status: string;
  obrazekId: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  alt: string;
  status_id: number;
  fetchpriority?: boolean;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  isHomepage?: boolean;
};
const VITE_API_URL = import.meta.env.VITE_API_URL;
function Card(props: Props) {
  const { lang } = useLang();
  return (
    <div className={`card ${props.status_id === 2 ? "status-2-active" : ""}`}>
      <Link to={`/${lang}/listings/${props.id}`} className="card-image">
        <img
          loading={props.fetchpriority ? "eager" : "lazy"}
          fetchPriority={props.fetchpriority ? "high" : "auto"}
          src={`${VITE_API_URL}/api/files/images/${props.obrazekId}`}
          alt={props.alt}
          className="card-img"
          width={"315"}
          height={"218"}
        />
        <div className={`card-status status-${props.status_id}`}>
          {props.status}
        </div>
      </Link>
      {props.isHomepage ?? (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "70px",
            height: "70px",
            zIndex: 8,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.4)",
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              pointerEvents: "none",
            }}
          />

          <Favorite
            favorited={props.favorited}
            onToggleFavorite={props.onToggleFavorite}
            list={true}
            top={-16}
            left={-60}
          />
        </div>
      )}

      <div className="card-first-row">
        <div className="card-location">
          <img src="/utils/map-pin.svg" alt="map pin" loading="lazy" />
          <Link to={`/${lang}/listings/${props.id}`} className="card-loc-link">
            {props.lokace}
          </Link>
        </div>
        <div className="card-icons">
          <img src="/utils/bed.svg" alt="bed" loading="lazy" />
          <p className="spaced6 number">{props.loznice}</p>
          <img src="/utils/bath.svg" alt="bath" loading="lazy" />
          <p className="spaced6 number">{props.koupelny}</p>
          <img src="/utils/size.svg" alt="size" loading="lazy" />
          <p className="number">{props.velikost} m²</p>
        </div>
      </div>
      <div className="card-second-row">
        <p>{props.titulek} </p>
      </div>
      <div className="card-third-row">
        <p>{props.typ}</p>
        <div className="card-price number">
          <b className="bold-num"> {formatMoneyEUR(props.cena_v_eur)}</b>
        </div>
      </div>
    </div>
  );
}

export default Card;
