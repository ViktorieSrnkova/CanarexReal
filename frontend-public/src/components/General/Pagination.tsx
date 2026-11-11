import { useT } from "../../i18n";
import "../../styles/general/pagination.css";
import { useEffect, useState } from "react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  loading?: boolean;
  visible?: boolean;
};

function Pagination({ page, totalPages, onChange, loading = false }: Props) {
  const t = useT();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 780,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPages = (): (number | string)[] => {
    if (isMobile) {
      if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (page <= 2) {
        return [1, 2, "...", totalPages - 1, totalPages];
      }

      if (page >= totalPages - 1) {
        return [1, 2, "...", totalPages - 1, totalPages];
      }

      return [1, "...", page, "...", totalPages];
    }

    // Desktop - original behavior
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 2 || page >= totalPages - 1) {
      return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const goPrev = () => {
    if (!loading && page > 1) onChange(page - 1);
  };

  const goNext = () => {
    if (!loading && page < totalPages) onChange(page + 1);
  };

  return (
    <div className={`pagination ${loading ? "loading" : ""} `}>
      <button className="btn" disabled={loading || page === 1} onClick={goPrev}>
        <img
          className="arrow-pg"
          src="/utils/arrow-left.svg"
          alt="arrow left"
        />
        {t("listings.back")}
      </button>

      {(loading ? [1, 2, 3, 4, 5] : getPages()).map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="dots">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`number ${p === page ? "active" : ""}`}
            onClick={() => !loading && onChange(p as number)}
            disabled={loading}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="btn"
        disabled={loading || page === totalPages}
        onClick={goNext}
      >
        {t("listings.next")}
        <img
          className="arrow-pg"
          src="/utils/arrow-right.svg"
          alt="arrow right"
        />
      </button>
    </div>
  );
}
export default Pagination;
