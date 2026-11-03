import Dropdown from "./Dropdown";
import FiltersWrapper from "../Forms/FiltersWrapper";
import Button from "./Button";
import { useT } from "../../i18n";
import type { ListingSort } from "../../types/filters";
import type { FormValues } from "../../types/forms";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../hooks/i18n/useLang";
import "../../styles/components/filters.css";

import { useEffect, useState } from "react";
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
  hasAppliedFilters: boolean;
  onIndexSearch: (index: number) => void;
  onClearIndexSearch: () => void;
  isIndexSearchActive: boolean;
  searchedIndex: number | null;
  disabled: boolean;
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
  hasAppliedFilters,
  onIndexSearch,
  onClearIndexSearch,
  isIndexSearchActive,
  searchedIndex,
  disabled,
}: Props) {
  const t = useT();
  const { lang } = useLang();
  const location = useLocation();

  const isMapPage = location.pathname.endsWith("/map");

  const backLink = isMapPage ? `/${lang}/listings` : `/${lang}/map`;
  const [indexInput, setIndexInput] = useState(searchedIndex?.toString() ?? "");
  const [indexError, setIndexError] = useState("");
  const backLabel = isMapPage
    ? !hasAppliedFilters && !isIndexSearchActive
      ? t("listings.moveToList")
      : t("listings.filterList")
    : !hasAppliedFilters && !isIndexSearchActive
      ? t("listings.moveToMap")
      : t("listings.filterMap");

  const SORT_OPTIONS = [
    { label: t("listings.newest"), value: "date" },
    { label: t("listings.lowestPrice"), value: "price_asc" },
    { label: t("listings.highestPrice"), value: "price_desc" },
  ] as const;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndexInput(searchedIndex?.toString() ?? "");
  }, [searchedIndex]);
  const submitIndexSearch = () => {
    const index = Number(indexInput);

    if (!indexInput.trim() || !Number.isInteger(index)) {
      setIndexError("Zadejte platné číslo inzerátu.");
      return;
    }

    if (index < 250000 || index > 270000) {
      setIndexError("chybně zadané ID inzerátu.");
      return;
    }

    setIndexError("");
    onIndexSearch(index);
  };
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
        <div className="navigation-btn">
          <Link
            to={{
              pathname: backLink,
              search: location.search,
            }}
            className="back-to"
          >
            {backLabel} →
          </Link>
        </div>

        {showSorting && sort && setSort && (
          <>
            <h2> {t("listings.sort")}</h2>

            <Dropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={(val) => setSort(val)}
            />

            <hr className="filter-hr" />
          </>
        )}
        <div className="index-search-wrapper">
          <h2> {t("listings.searchByIndex")}</h2>

          <div className="index-search">
            <input
              type="number"
              placeholder="ID"
              value={indexInput}
              onChange={(e) => {
                setIndexInput(e.target.value);
                setIndexError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitIndexSearch();
                }
              }}
            />
            <Button onClick={submitIndexSearch}>⌕</Button>
            {isIndexSearchActive && (
              <Button onClick={onClearIndexSearch} variant="danger">
                X
              </Button>
            )}
          </div>
          {indexError && <p className="index-search-error">{indexError}</p>}
        </div>
        <hr className="filter-hr" />
        <h2> {t("listings.filter")}</h2>
        <fieldset disabled={disabled} className="filters-disabled">
          <FiltersWrapper
            value={formFilters}
            onChange={setFormFilters}
            priceRange={priceRange}
            sizeRange={sizeRange}
          />
        </fieldset>
        <div className="button-wrapper">
          <Button onClick={handleSubmit} disabled={disabled}>
            {t("listings.submit")}
          </Button>
          {!isDefault && (
            <Button onClick={handleClear} variant="danger" disabled={disabled}>
              {t("listings.clear")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Filters;
