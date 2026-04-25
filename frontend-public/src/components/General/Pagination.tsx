import { useT } from "../../i18n";
import "../../styles/general/pagination.css";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function Pagination({ page, totalPages, onChange }: Props) {
  const t = useT();

  const getPages = () => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 2 || page >= totalPages - 1) {
      return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="pagination">
      <button
        className="btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <img className="arrow" src="/utils/arrow-left.svg" alt="arrow left" />{" "}
        {t("listings.back")}
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="dots">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`number ${p === page ? "active" : ""}`}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="btn"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        {t("listings.next")}{" "}
        <img className="arrow" src="/utils/arrow-right.svg" alt="arrow right" />
      </button>
    </div>
  );
}
export default Pagination;
