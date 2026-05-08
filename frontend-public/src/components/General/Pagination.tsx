import { useT } from "../../i18n";
import "../../styles/general/pagination.css";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  loading?: boolean;
};

function Pagination({ page, totalPages, onChange, loading = false }: Props) {
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
    <div className={`pagination ${loading ? "loading" : ""}`}>
      <button className="btn" disabled>
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

      <button className="btn" disabled>
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
