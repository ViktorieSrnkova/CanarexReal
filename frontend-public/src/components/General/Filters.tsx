import Dropdown from "./Dropdown";
import FiltersWrapper from "../Forms/FiltersWrapper";
import Button from "./Button";
import { useT } from "../../i18n";
import type { ListingSort } from "../../types/filters";
import type { FormValues } from "../../types/forms";
type Props = {
  sort?: ListingSort;
  setSort?: (val: ListingSort) => void;
  formFilters: FormValues;
  setFormFilters: React.Dispatch<React.SetStateAction<FormValues>>;
  handleSubmit: () => void;
  handleClear: () => void;
  isDefault: boolean;
  priceRange: number[];
  sizeRange: number[];
  showSorting?: boolean;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
};

function Filters({
  sort,
  setSort,
  formFilters,
  setFormFilters,
  filtersOpen,
  setFiltersOpen,
  handleSubmit,
  handleClear,
  isDefault,
  priceRange,
  sizeRange,
  showSorting = true,
}: Props) {
  const t = useT();

  const SORT_OPTIONS = [
    { label: t("listings.newest"), value: "date" },
    { label: t("listings.lowestPrice"), value: "price_asc" },
    { label: t("listings.highestPrice"), value: "price_desc" },
  ] as const;
  return (
    <>
      <button className="filters-toggle" onClick={() => setFiltersOpen(true)}>
        {t("listings.filters")}
      </button>
      <div className={`filters ${filtersOpen ? "open" : ""}`}>
        <div className="filters-header">
          <div className="close" onClick={() => setFiltersOpen(false)}>
            ×
          </div>
        </div>
        {showSorting && sort && setSort && (
          <>
            <h2> {t("listings.sort")}</h2>

            <Dropdown
              label={t("listings.sortLabel")}
              value={sort}
              options={SORT_OPTIONS}
              onChange={(val) => setSort(val)}
            />

            <hr className="filter-hr" />
          </>
        )}
        <h2> {t("listings.filter")}</h2>
        <FiltersWrapper
          value={formFilters}
          onChange={setFormFilters}
          priceRange={priceRange}
          sizeRange={sizeRange}
        />

        <div className="button-wrapper">
          <Button onClick={handleSubmit}> {t("listings.submit")}</Button>
          {!isDefault && (
            <Button onClick={handleClear} variant="danger">
              {t("listings.clear")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Filters;
