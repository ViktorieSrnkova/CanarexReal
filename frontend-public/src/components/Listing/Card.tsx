import { Link } from "react-router-dom";
import "../../styles/listing/card.css";

function Card() {
  return (
    <div className="card">
      <Link to="/listing/{id}" className="card-image">
        <div className="card-status">NOVÉ</div>
      </Link>
      <div className="card-first-row">
        <div className="card-location">
          <img src="/utils/map-pin.svg" alt="map pin" />
          <Link to="/listing/{id}" className="card-loc-link">
            San Eugenio Alto
          </Link>
        </div>
        <div className="card-icons">
          <img src="/utils/bed.svg" alt="map pin" />
          <p className="spaced6 number">1</p>
          <img src="/utils/bath.svg" alt="map pin" />
          <p className="spaced6 number">1</p>
          <img src="/utils/size.svg" alt="map pin" />
          <p className="number">92m²</p>
        </div>
      </div>
      <div className="card-second-row">
        <p>Prostorný apartmán v Malibu Park, San Eugenio Alto</p>
      </div>
      <div className="card-third-row">
        <p>Apartmán</p>
        <div className="card-price number">260 000 €</div>
      </div>
    </div>
  );
}

export default Card;
