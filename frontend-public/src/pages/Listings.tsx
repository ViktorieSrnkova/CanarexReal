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
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import type { FormValues } from "../types/forms";
import { useT } from "../i18n";
import NoFilters from "../components/Listing/NoFilters";

function Listings() {
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const langId = LANGUAGE_TO_ID[lang];
  const [listings, setListings] = useState<ListingThumbnail[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = (searchParams.get("view") as "list" | "map") || "list";
  const [clicked, setClicked] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const limit = 9;
  const totalPages = Math.ceil(total / limit);
  const SORT_OPTIONS = [
    { label: t("listings.newest"), value: "date" },
    { label: t("listings.lowestPrice"), value: "price_asc" },
    { label: t("listings.highestPrice"), value: "price_desc" },
  ] as const;
  const defaultFilters: FormValues = {
    type: [],
    priceFrom: 80000,
    priceTo: 1000000,
    sizeFrom: 0,
    sizeTo: 300,
    bedrooms: [],
    bathrooms: [],
    arrivalMode: "unknown",
    arrival: null,
  };
  const [sort, setSort] = useState<ListingSort>("date");
  const [filters, setFilters] = useState<FormValues>(defaultFilters);
  const [formFilters, setFormFilters] = useState<FormValues>(defaultFilters);

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
  }, [page, langId, filters, sort]);

  const selected = useMemo(
    () => listings.find((l) => l.id === selectedListing),
    [listings, selectedListing],
  );
  const handleMarkerClick = (id: number) => {
    if (window.innerWidth <= 600) {
      navigate(`/properties/${id}`);
    } else {
      setSelectedListing(id);
    }
  };

  function hasCoords(
    l: ListingThumbnail,
  ): l is ListingThumbnail & { adresy: { lat: number; lng: number } } {
    return l.adresy?.lat != null && l.adresy?.lng != null && l.statusy_id === 1;
  }
  const setView = (v: "list" | "map") => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("view", v);
      return p;
    });
  };

  const handleSubmit = async () => {
    setPage(1);
    setFilters(formFilters);
  };

  const isDefault =
    formFilters.type.length === 0 &&
    formFilters.priceFrom === defaultFilters.priceFrom &&
    formFilters.priceTo === defaultFilters.priceTo &&
    formFilters.sizeFrom === defaultFilters.sizeFrom &&
    formFilters.sizeTo === defaultFilters.sizeTo &&
    formFilters.bedrooms.length === 0 &&
    formFilters.bathrooms.length === 0;

  const handleClear = async () => {
    setFilters(defaultFilters);
    setFormFilters(defaultFilters);
  };

  return (
    <div className="content">
      <div className="listings-wrapper">
        <div className="filters">
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
          <FiltersWrapper value={formFilters} onChange={setFormFilters} />
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
                        listing.obrazky[0]?.obrazky_preklady[0]?.alt_text ?? "",
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
                          titulek={selected.inzeraty_preklady[0]?.titulek ?? ""}
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
                        onClick={() => navigate(`/listings/${selected?.id}`)}
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
  );
}

export default Listings;
