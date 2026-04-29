import { useEffect, useState } from "react";
import Card from "./Card";
import type { ListingThumbnail } from "../../types/rawApi";
import "../../styles/listing/carrousel.css";

type Props = {
  similar: ListingThumbnail[];
  loading: boolean;
  title: string;
  loadTxt: string;
  errTxt: string;
};

function Carrousel(props: Props) {
  const similar = props.similar;
  const [startIndex, setStartIndex] = useState(0);
  const total = similar.length;
  const [visibleCount, setVisibleCount] = useState(3);
  const isEmpty = total === 0;
  const isStatic = total > 0 && total <= 3;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1112) {
        setVisibleCount(1);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const mapCard = (sim: ListingThumbnail) => ({
    id: sim.id,
    titulek: sim.inzeraty_preklady[0]?.titulek ?? "",
    lokace: sim.adresy?.lokace ?? "",
    typ: sim.typy_nemovitosti?.typy_nemovitosti_preklady[0]?.nazev ?? "",
    status: sim.statusy?.statusy_preklady?.[0]?.nazev ?? "",
    cena_v_eur: sim.cena_v_eur,
    loznice: sim.loznice,
    koupelny: sim.koupelny,
    velikost: sim.velikost,
    obrazekId: sim.obrazky?.[0]?.id ?? 0,
    alt: sim.obrazky?.[0]?.obrazky_preklady?.[0]?.alt_text ?? "",
    status_id: sim.statusy_id,
  });

  const getVisibleItems = () => {
    if (similar.length === 0) return [];

    return Array.from({ length: visibleCount }).map((_, i) => {
      const index = (startIndex + i) % similar.length;
      return similar[index];
    });
  };

  const next = () => {
    if (!similar.length) return;
    setStartIndex((prev) => (prev + 1) % similar.length);
  };

  const prev = () => {
    if (!similar.length) return;
    setStartIndex((prev) => (prev - 1 + similar.length) % similar.length);
  };
  if (props.loading) {
    return (
      <div className="crsl-wrapper">
        <h2>{props.title}</h2>
        <div>{props.loadTxt}</div>
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="crsl-wrapper">
        <div className="crsl-first-row">
          <h2>{props.title}</h2>
        </div>

        <div className="crsl-second-row">
          <p>{props.errTxt}</p>
        </div>
      </div>
    );
  }
  if (isStatic) {
    return (
      <div className="crsl-wrapper">
        <div className="crsl-first-row">
          <h2>{props.title}</h2>
        </div>

        <div className="crsl-second-row">
          <div className="crsl-listings-wrapper">
            {similar.map((sim) => (
              <Card key={sim.id} {...mapCard(sim)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const visibleItems = getVisibleItems();
  return (
    <div className="crsl-wrapper">
      <div className="crsl-first-row">
        <h2>{props.title}</h2>
      </div>

      <div className="crsl-second-row">
        <div className="arrow-left" onClick={prev}></div>

        <div className="crsl-listings-wrapper">
          {visibleItems.map((sim) => (
            <Card key={sim.id} {...mapCard(sim)} />
          ))}
        </div>

        <div className="arrow-right" onClick={next}></div>
      </div>

      <div className="crsl-third-row">
        {similar.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === startIndex ? "active" : ""}`}
            onClick={() => setStartIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carrousel;
