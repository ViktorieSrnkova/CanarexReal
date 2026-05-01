import { Link } from "react-router-dom";
import "../../styles/listing/card.css";
import { formatMoneyEUR } from "../../utils/formatting";

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
};
const VITE_API_URL = import.meta.env.VITE_API_URL;
function Card(props: Props) {
  return (
    <div className={`card ${props.status_id === 2 ? "status-2-active" : ""}`}>
      <Link to={`/listings/${props.id}`} className="card-image">
        <img
          src={` ${VITE_API_URL}/api/files/images/${props.obrazekId}`}
          alt={props.alt}
          className="card-img"
          loading="lazy"
        />{" "}
        <div className={`card-status status-${props.status_id}`}>
          {props.status}
        </div>
      </Link>

      <div className="card-first-row">
        <div className="card-location">
          <img src="/utils/map-pin.svg" alt="map pin" />
          <Link to={`/listings/${props.id}`} className="card-loc-link">
            {props.lokace}
          </Link>
        </div>
        <div className="card-icons">
          <img src="/utils/bed.svg" alt="map pin" />
          <p className="spaced6 number">{props.loznice}</p>
          <img src="/utils/bath.svg" alt="map pin" />
          <p className="spaced6 number">{props.koupelny}</p>
          <img src="/utils/size.svg" alt="map pin" />
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
