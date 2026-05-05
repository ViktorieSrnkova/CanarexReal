/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Listing/Card";
import type { ListingThumbnail } from "../types/rawApi";
import { getListingsThumbs } from "../api/listings";
import "../styles/pages/listings.css";
import Pagination from "../components/General/Pagination";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import FiltersWrapper from "../components/Forms/FiltersWrapper";
import Button from "../components/General/Button";
import Dropdown from "../components/General/Dropdown";
import { type ListingSort } from "../types/filters";
import SearchMap from "../components/Listing/SearchMap";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { FormValues } from "../types/forms";
import { useT } from "../i18n";
import NoFilters from "../components/Listing/NoFilters";
import SEO from "../components/SEO/Meta";
import { useRanges } from "../RangesContext";

function Listings() {
  const ranges = useRanges();
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const langId = LANGUAGE_TO_ID[lang];
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 9;
  const view = (searchParams.get("view") as "list" | "map") || "list";
  const page = Number(searchParams.get("page") || 1);
  const sort = (searchParams.get("sort") as ListingSort) || "date";
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);
  const [clicked, setClicked] = useState(false);
  const SORT_OPTIONS = [
    { label: t("listings.newest"), value: "date" },
    { label: t("listings.lowestPrice"), value: "price_asc" },
    { label: t("listings.highestPrice"), value: "price_desc" },
  ] as const;
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    if (filtersOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [filtersOpen]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);
  const rangesReady = ranges !== null;
  const priceRange = ranges === null ? [0, 0] : ranges.price;
  const sizeRange = ranges === null ? [0, 0] : ranges.size;

  const parseArray = (val: string | null) =>
    val ? val.split(",").map(Number) : [];

  const filterString = searchParams.toString();
  const filtersReady = !!priceRange && !!sizeRange;

  const defaultFilters = useMemo<FormValues>(
    () => ({
      type: [],
      priceFrom: priceRange[0],
      priceTo: priceRange[1],
      sizeFrom: sizeRange[0],
      sizeTo: sizeRange[1],
      bedrooms: [],
      bathrooms: [],
      arrivalMode: "unknown",
      arrival: null,
    }),
    [priceRange, sizeRange],
  );

  const filters = useMemo<FormValues>(
    () => ({
      type: parseArray(searchParams.get("type")),
      priceFrom: Number(searchParams.get("priceFrom") || priceRange[0]),
      priceTo: Number(searchParams.get("priceTo") || priceRange[1]),
      sizeFrom: Number(searchParams.get("sizeFrom") || sizeRange[0]),
      sizeTo: Number(searchParams.get("sizeTo") || sizeRange[1]),
      bedrooms: parseArray(searchParams.get("bedrooms")),
      bathrooms: parseArray(searchParams.get("bathrooms")),
      arrivalMode: "unknown",
      arrival: null,
    }),
    [filterString, priceRange, sizeRange],
  );

  const [formFilters, setFormFilters] = useState<FormValues>(() => filters);
  useEffect(() => {
    if (!rangesReady) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormFilters(filters);
  }, [rangesReady, filterString]);

  const setURL = (updates: Record<string, string | number | null>) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) p.delete(key);
        else p.set(key, String(value));
      });

      return p;
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { thumbnails, total } = await getListingsThumbs(langId, {
          page,
          limit,
          filters,
          sort,
        });

        setListings(thumbnails);
        setTotal(total);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [page, langId, filterString, sort, rangesReady]);

  const selected = useMemo(
    () => listings.find((l) => l.id === selectedListing),
    [listings, selectedListing],
  );
  const handleMarkerClick = (id: number) => {
    if (window.innerWidth <= 600) {
      navigate(`/${lang}/listings/${id}`);
    } else {
      setSelectedListing(id);
    }
  };

  function hasCoords(
    l: ListingThumbnail,
  ): l is ListingThumbnail & { adresy: { lat: number; lng: number } } {
    return l.adresy?.lat != null && l.adresy?.lng != null && l.statusy_id === 1;
  }

  const setPage = (p: number) => {
    setURL({ page: p });
  };

  const setSort = (val: ListingSort) => {
    setURL({ sort: val, page: 1 });
  };

  const setView = (v: "list" | "map") => {
    setURL({ view: v });
  };

  const handleSubmit = () => {
    setURL({
      page: 1,
      priceFrom: formFilters.priceFrom,
      priceTo: formFilters.priceTo,
      sizeFrom: formFilters.sizeFrom,
      sizeTo: formFilters.sizeTo,
      type: formFilters.type.join(","),
      bedrooms: formFilters.bedrooms.join(","),
      bathrooms: formFilters.bathrooms.join(","),
    });

    setFiltersOpen(false);
  };

  const isDefault =
    formFilters.type.length === 0 &&
    formFilters.priceFrom === defaultFilters.priceFrom &&
    formFilters.priceTo === defaultFilters.priceTo &&
    formFilters.sizeFrom === defaultFilters.sizeFrom &&
    formFilters.sizeTo === defaultFilters.sizeTo &&
    formFilters.bedrooms.length === 0 &&
    formFilters.bathrooms.length === 0;

  const handleClear = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      [
        "type",
        "priceFrom",
        "priceTo",
        "sizeFrom",
        "sizeTo",
        "bedrooms",
        "bathrooms",
      ].forEach((key) => p.delete(key));

      p.set("page", "1");

      return p;
    });
    setFormFilters(defaultFilters);
  };
  if (!filtersReady) {
    return <p>{t("general.loading")}</p>;
  }

  return (
    <>
      <SEO
        title={t("SEO.Listings_title")}
        description={t("SEO.Listings_description")}
      />
      <div className="content">
        <button className="filters-toggle" onClick={() => setFiltersOpen(true)}>
          Filtry
        </button>
        <div className="listings-wrapper">
          <div className={`filters ${filtersOpen ? "open" : ""}`}>
            <div className="filters-header">
              <div className="close" onClick={() => setFiltersOpen(false)}>
                ×
              </div>
            </div>
            <div className="view-switch">
              <button
                className={`list ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
              >
                <img src="/listings/List.svg" />
                {t("listings.list")}
              </button>

              <button
                className={`map ${view === "map" ? "active" : ""}`}
                onClick={() => setView("map")}
              >
                <img src="/listings/Map.svg" />
                {t("listings.map")}
              </button>
            </div>
            {view === "list" && (
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
            {rangesReady ? (
              <FiltersWrapper
                key={filterString}
                value={formFilters}
                onChange={setFormFilters}
                priceRange={priceRange}
                sizeRange={sizeRange}
              />
            ) : (
              <div className="loading-spinner" />
            )}

            <div className="button-wrapper">
              <Button onClick={handleSubmit}> {t("listings.submit")}</Button>
              {!isDefault && (
                <Button onClick={handleClear} variant="danger">
                  {t("listings.clear")}
                </Button>
              )}
            </div>
          </div>
          <div className="listings">
            {view === "list" ? (
              <>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
                {listings.length === 0 ? (
                  <NoFilters />
                ) : (
                  <div className="hp-cards-wrapper">
                    {listings.map((listing) => {
                      const cardData = {
                        id: listing.id,
                        titulek: listing.inzeraty_preklady[0]?.titulek ?? "",
                        lokace: listing.adresy?.lokace ?? "",
                        typ:
                          listing.typy_nemovitosti?.typy_nemovitosti_preklady[0]
                            ?.nazev ?? "",
                        status: listing.statusy.statusy_preklady[0].nazev ?? "",
                        cena_v_eur: listing.cena_v_eur,
                        loznice: listing.loznice,
                        koupelny: listing.koupelny,
                        velikost: listing.velikost,
                        obrazekId: listing.obrazky[0]?.id ?? 0,
                        alt:
                          listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ??
                          "",
                        status_id: listing.statusy_id,
                      };

                      return <Card key={listing.id} {...cardData} />;
                    })}
                  </div>
                )}
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </>
            ) : (
              <div className="map-wrapper-listing">
                {listings.length === 0 ? (
                  <NoFilters />
                ) : (
                  <>
                    <SearchMap
                      markers={listings.filter(hasCoords).map((l) => ({
                        id: l.id,
                        price: l.cena_v_eur,
                        position: {
                          lat: l.adresy?.lat,
                          lng: l.adresy?.lng,
                        },
                      }))}
                      selectedId={selectedListing}
                      onMarkerClick={(id) => {
                        handleMarkerClick(id);
                        setClicked(true);
                      }}
                    />
                    {clicked && (
                      <div className="result">
                        <div
                          className="result-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            setClicked(false);
                            setSelectedListing(null);
                          }}
                        >
                          ×
                        </div>

                        {selected && (
                          <Card
                            id={selected.id}
                            titulek={
                              selected.inzeraty_preklady[0]?.titulek ?? ""
                            }
                            lokace={selected.adresy?.lokace ?? ""}
                            typ={
                              selected.typy_nemovitosti
                                ?.typy_nemovitosti_preklady[0]?.nazev ?? ""
                            }
                            status={
                              selected.statusy?.statusy_preklady[0]?.nazev ?? ""
                            }
                            cena_v_eur={selected.cena_v_eur}
                            loznice={selected.loznice}
                            koupelny={selected.koupelny}
                            velikost={selected.velikost}
                            obrazekId={selected.obrazky[0]?.id ?? 0}
                            alt={
                              selected.obrazky[0]?.obrazky_preklady[0]
                                ?.alt_text ?? ""
                            }
                            status_id={selected.statusy_id}
                          />
                        )}
                        <Button
                          onClick={() =>
                            navigate(`/${lang}/listings/${selected?.id}`)
                          }
                        >
                          {t("listings.goTo")}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Listings;
